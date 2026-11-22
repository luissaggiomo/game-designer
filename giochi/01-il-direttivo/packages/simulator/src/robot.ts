/**
 * Giocatori-robot (Architettura §14).
 *
 * Ogni robot decide vedendo SOLO la propria vista filtrata e gli eventi che riceve, come un
 * giocatore vero. Conosce in più il materiale di gioco pubblico (il mazzo dei segreti), che usa
 * per capire a quale reparto serve un segreto.
 *
 * Limiti: i robot non parlano, non mentono a voce e non persuadono. Il simulatore trova gli
 * squilibri numerici evidenti, non misura il divertimento.
 */
import type { Ambiente, Azione, Casuale, Evento, GiocatoreId, VistaGiocatore } from "@il-direttivo/engine";

export interface Profilo {
  nome: "COOPERATIVO" | "EGOISTA" | "SPIA_PRUDENTE" | "SPIA_AGGRESSIVA";
  /** Probabilità di scegliere "reparto" nella mossa privata (per le spie: sabotaggio). */
  egoismo: number;
  /** Vota sì se l'effetto sul proprio reparto è almeno questo. */
  sogliaVoto: number;
  /** Probabilità di condividere un segreto con il reparto a cui serve. */
  condivisione: number;
  /** Solo spie: probabilità di votare no per sabotare, o di inoltrare un segreto falsato. */
  sabotaggio: number;
  /** Solo spie: la prudente consegna al concorrente solo segreti ricevuti da altri (più persone li conoscono). */
  prudente: boolean;
}

export const PROFILI: Record<Profilo["nome"], Profilo> = {
  COOPERATIVO: { nome: "COOPERATIVO", egoismo: 0.15, sogliaVoto: -1, condivisione: 0.8, sabotaggio: 0, prudente: false },
  EGOISTA: { nome: "EGOISTA", egoismo: 0.6, sogliaVoto: 1, condivisione: 0.4, sabotaggio: 0, prudente: false },
  SPIA_PRUDENTE: { nome: "SPIA_PRUDENTE", egoismo: 0.5, sogliaVoto: 1, condivisione: 0.5, sabotaggio: 0.4, prudente: true },
  SPIA_AGGRESSIVA: { nome: "SPIA_AGGRESSIVA", egoismo: 0.85, sogliaVoto: 2, condivisione: 0.3, sabotaggio: 0.8, prudente: false },
};

/** Sospetto oltre il quale un robot onesto accusa (propone il demansionamento, risponde "no", nomina). */
const SOGLIA_SOSPETTO = 3;

export class Robot {
  readonly sospetto = new Map<GiocatoreId, number>();
  private readonly inviati: { titolo: string; a: GiocatoreId }[] = [];
  private readonly ricevuti: { titolo: string; da: GiocatoreId }[] = [];
  private readonly condivisi = new Set<string>();
  private readonly consegnati = new Set<string>();

  constructor(
    readonly id: GiocatoreId,
    readonly profilo: Profilo,
    private readonly ambiente: Ambiente,
    private readonly casuale: Casuale,
  ) {}

  private spia(v: VistaGiocatore) {
    return v.io.fazione.tipo === "SPIA";
  }

  private aumenta(id: GiocatoreId, quanto: number) {
    if (id === this.id) return;
    this.sospetto.set(id, (this.sospetto.get(id) ?? 0) + quanto);
  }

  private piuSospetto(candidati: GiocatoreId[]): { id: GiocatoreId; valore: number } | undefined {
    let migliore: { id: GiocatoreId; valore: number } | undefined;
    for (const id of this.casuale.mescola(candidati)) {
      const valore = this.sospetto.get(id) ?? 0;
      if (!migliore || valore > migliore.valore) migliore = { id, valore };
    }
    return migliore;
  }

  /** Aggiorna i sospetti in base agli eventi ricevuti (solo informazioni a cui il robot ha diritto). */
  osserva(eventi: Evento[], v: VistaGiocatore): void {
    if (this.spia(v)) return;
    for (const e of eventi) {
      if (e.tipo === "SEGRETO_USATO" || e.tipo === "FUGA_DI_NOTIZIE") {
        // Un segreto è finito al concorrente: chi l'ha ricevuto da me o me l'ha passato diventa sospetto.
        for (const x of this.inviati.filter((i) => e.causa.includes(i.titolo))) this.aumenta(x.a, 3);
        for (const x of this.ricevuti.filter((r) => e.causa.includes(r.titolo))) this.aumenta(x.da, 2);
      }
      if (e.tipo === "VOTAZIONE_CHIUSA" && !e.approvata) {
        // Chi blocca proposte buone per il mio reparto mi insospettisce un poco.
        const mio = v.mieiEffetti[e.propostaId]?.punti ?? 0;
        if (mio > 0) for (const [id, voto] of Object.entries(e.voti)) if (voto === "NO") this.aumenta(id, 0.3);
      }
    }
  }

  /** Azioni per le fasi "normali" del trimestre e per il finale. */
  agisci(v: VistaGiocatore): Azione[] {
    const io = v.giocatori.find((g) => g.id === this.id)!;
    const azioni: Azione[] = [];
    const r = this.casuale;
    const p = this.profilo;
    const spia = this.spia(v);

    switch (v.fase.nome) {
      case "RAPPORTO":
      case "DISCUSSIONE": {
        for (const copia of v.mieiSegreti.filter((c) => c.trimestre === v.trimestre)) {
          // Consegna al concorrente (spie).
          if (spia && !this.consegnati.has(copia.id)) {
            const ricevutoDaAltri = copia.provenienza.tipo === "GIOCATORE";
            if (!p.prudente || ricevutoDaAltri) {
              this.consegnati.add(copia.id);
              azioni.push({ tipo: "PASSA_AL_CONCORRENTE", da: this.id, copiaSegretoId: copia.id });
            }
          }
          // Condivisione con il reparto a cui serve (solo i dati del proprio reparto, una volta).
          if (copia.provenienza.tipo !== "GIOCO" || this.condivisi.has(copia.id)) continue;
          this.condivisi.add(copia.id);
          const utile = v.giocatori.find((g) => g.repartoId === copia.utileA && g.stato === "ATTIVO");
          if (!utile || utile.id === this.id || !r.probabilita(p.condivisione)) continue;
          const falsifica = spia && r.probabilita(p.sabotaggio);
          // Falso credibile: un altro dei valori suggeriti dal telefono (D-036).
          const campo = Object.keys(copia.campi)[0];
          const alternativa = campo ? copia.valoriSuggeriti[campo]?.find((x) => x !== copia.campi[campo]) : undefined;
          azioni.push({
            tipo: "INVIA_MESSAGGIO",
            da: this.id,
            a: utile.id,
            anonimo: false,
            modello: "SEGRETO",
            copiaSegretoId: copia.id,
            ...(falsifica && campo ? { campi: { [campo]: alternativa ?? `${copia.campi[campo]} (ritoccato)` } } : {}),
          });
          this.inviati.push({ titolo: copia.titolo, a: utile.id });
        }
        // Registra i segreti ricevuti da altri (per i sospetti).
        for (const copia of v.mieiSegreti) {
          if (copia.provenienza.tipo === "GIOCATORE" && copia.provenienza.da && !this.ricevuti.some((x) => x.titolo === copia.titolo)) {
            this.ricevuti.push({ titolo: copia.titolo, da: copia.provenienza.da });
          }
        }
        break;
      }
      case "VOTAZIONE": {
        if (io.stato !== "ATTIVO") break;
        const proposta = v.ordineDelGiorno[v.fase.votazione - 1];
        if (!proposta || (proposta.pesi[v.io.repartoId] ?? 0) === 0) break;
        const effetto = v.mieiEffetti[proposta.id]?.punti ?? 0;
        let voto: "SI" | "NO" | "ASTENUTO" = effetto >= p.sogliaVoto ? "SI" : "NO";
        if (spia && r.probabilita(p.sabotaggio)) voto = "NO";
        if (proposta.astensioneAmmessa && effetto === 0 && r.probabilita(0.5)) voto = "ASTENUTO";
        azioni.push({ tipo: "VOTA", da: this.id, voto });
        break;
      }
      case "MOSSA_PRIVATA":
        if (io.stato === "ATTIVO") azioni.push({ tipo: "MOSSA_PRIVATA", da: this.id, scelta: r.probabilita(p.egoismo) ? "REPARTO" : "AZIENDA" });
        break;
      case "VERIFICA": {
        if (io.stato !== "ATTIVO") break;
        const altri = v.giocatori.filter((g) => g.stato === "ATTIVO" && g.id !== this.id).map((g) => g.id);
        const sospettoMassimo = this.piuSospetto(altri)?.valore ?? 0;
        azioni.push({ tipo: "VERIFICA_FINALE", da: this.id, soloOnesti: spia || sospettoMassimo < SOGLIA_SOSPETTO });
        break;
      }
      case "NOMINA": {
        if (io.stato !== "ATTIVO") break;
        const ammessi = (v.finale.ballottaggio.length > 0 ? v.finale.ballottaggio : v.giocatori.filter((g) => g.stato === "ATTIVO").map((g) => g.id)).filter(
          (id) => id !== this.id && !v.io.alleati.includes(id),
        );
        if (ammessi.length === 0) break;
        const bersaglio = spia ? r.scegli(ammessi) : this.piuSospetto(ammessi)!.id;
        azioni.push({ tipo: "NOMINA_SPIA", da: this.id, bersaglio });
        break;
      }
      default:
        break;
    }
    return azioni;
  }

  /** Fase 6: una proposta (promozione o demansionamento), se il robot ne ha una. */
  proponi(v: VistaGiocatore): Azione | undefined {
    const io = v.giocatori.find((g) => g.id === this.id)!;
    if (io.stato === "DEMANSIONATO") return { tipo: "PROPONI_PROMOZIONE", da: this.id, bersaglio: this.id };
    if (io.stato !== "ATTIVO" || v.fase.nome !== "DEMANSIONAMENTO") return undefined;
    const altri = v.giocatori.filter((g) => g.stato === "ATTIVO" && g.id !== this.id && !v.io.alleati.includes(g.id)).map((g) => g.id);
    if (altri.length === 0) return undefined;
    if (this.spia(v)) {
      return this.casuale.probabilita(0.15) ? { tipo: "PROPONI_DEMANSIONAMENTO", da: this.id, bersaglio: this.casuale.scegli(altri) } : undefined;
    }
    const sospettato = this.piuSospetto(altri);
    return sospettato && sospettato.valore >= SOGLIA_SOSPETTO ? { tipo: "PROPONI_DEMANSIONAMENTO", da: this.id, bersaglio: sospettato.id } : undefined;
  }

  /** Voto sulla promozione o sul demansionamento in corso. */
  votaPersonale(v: VistaGiocatore): Azione | undefined {
    const voto = v.votoPersonale;
    const io = v.giocatori.find((g) => g.id === this.id)!;
    // Nella decisione finale votano anche demansionati e licenziati (D-029).
    if (!voto || (io.stato !== "ATTIVO" && v.fase.nome !== "DECISIONE_FINALE") || voto.bersaglio === this.id) return undefined;
    const sospetto = this.sospetto.get(voto.bersaglio) ?? 0;
    const alleato = v.io.alleati.includes(voto.bersaglio);
    let si: boolean;
    if (voto.tipo === "PROMOZIONE") si = this.spia(v) ? alleato || this.casuale.probabilita(0.5) : sospetto < 2;
    else si = this.spia(v) ? !alleato && this.casuale.probabilita(0.7) : sospetto >= 2 || this.casuale.probabilita(0.2);
    return { tipo: voto.tipo === "PROMOZIONE" ? "VOTA_PROMOZIONE" : "VOTA_DEMANSIONAMENTO", da: this.id, voto: si ? "SI" : "NO" };
  }
}
