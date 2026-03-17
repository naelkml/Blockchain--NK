import { useState, useEffect, useRef } from 'react'
import { BrowserProvider, Contract } from 'ethers'
import ABI from './abi.json'
import { CONTRACT_ADDRESS, EXPECTED_CHAIN_ID, EXPECTED_NETWORK_NAME } from './config'
import './index.css'
import imgLeonBlum     from '../img/leon_blum.png'
import imgChirac       from '../img/chiraq.png'
import imgMitterrand   from '../img/miterrand.png'

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  mint:          '#17ebbd',
  mintGlow:      'rgba(23,235,189,0.25)',
  mintDim:       'rgba(23,235,189,0.1)',
  mintBorder:    'rgba(23,235,189,0.2)',
  orange:        '#ed622c',
  orangeDim:     'rgba(237,98,44,0.1)',
  orangeBorder:  'rgba(237,98,44,0.3)',
  gold:          '#efba32',
  goldDim:       'rgba(239,186,50,0.1)',
  goldBorder:    'rgba(239,186,50,0.3)',
  goldGlow:      'rgba(239,186,50,0.25)',
  teal:          '#02988e',
  tealDark:      '#152b2d',
  bg:            '#081213',
  bgCard:        '#0d2022',
  bgCard2:       '#0f1e20',
  border:        'rgba(217,217,217,0.12)',
  text:          '#d9d9d9',
  textMuted:     '#abd2d6',
  textDim:       '#4a6b6f',
  error:         '#cf2f26',
  errorDim:      'rgba(207,47,38,0.1)',
  errorBorder:   'rgba(207,47,38,0.3)',
  success:       '#2baa93',
  successDim:    'rgba(43,170,147,0.1)',
  successBorder: 'rgba(43,170,147,0.3)',
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #081213 0%, #0a1a1c 50%, #081213 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    fontFamily: "'JetBrains Mono', monospace",
    animation: 'fadeInUp 0.4s ease',
  },
  nav: {
    width: '100%',
    maxWidth: '1200px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '60px',
    borderBottom: `0.5px solid ${C.border}`,
    paddingBottom: '20px',
  },
  logo: { fontSize: '20px', fontWeight: '700', color: '#fff', letterSpacing: '1px', textTransform: 'uppercase' },
  logoDot: { color: C.orange },
  badge: {
    background: C.orangeDim, border: `0.5px solid ${C.orangeBorder}`, color: C.orange,
    padding: '4px 14px', borderRadius: '4px', fontSize: '11px', fontWeight: '600',
    letterSpacing: '1.5px', textTransform: 'uppercase',
  },
  hero: { textAlign: 'center', marginBottom: '60px', maxWidth: '620px' },
  tag: {
    display: 'inline-block', background: C.mintDim, border: `0.5px solid ${C.mintBorder}`,
    color: C.mint, padding: '4px 14px', borderRadius: '4px', fontSize: '11px',
    fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '24px',
  },
  h1: {
    fontSize: '44px', fontWeight: '800', lineHeight: '1.1', marginBottom: '16px',
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #ffffff 0%, #abd2d6 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  },
  subtitle: { fontSize: '14px', color: C.textMuted, lineHeight: '1.8', letterSpacing: '0.3px', fontWeight: '300' },
  card: {
    background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: '8px',
    padding: '32px', width: '100%', maxWidth: '1200px', marginBottom: '20px',
    boxShadow: '0px 10px 34px rgba(0,0,0,0.5)',
  },
  cardTitle: {
    fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase',
    color: C.textDim, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px',
  },
  cardTitleAccent: {
    display: 'inline-block', width: '3px', height: '12px', background: C.mint,
    borderRadius: '2px', boxShadow: `0 0 6px ${C.mintGlow}`, flexShrink: 0,
  },
  connectBtn: {
    background: C.mint, color: '#081213', border: 'none', padding: '13px 32px',
    borderRadius: '4px', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto',
    letterSpacing: '0.5px', boxShadow: `0 0 24px ${C.mintGlow}`, transition: 'all 0.2s ease',
  },
  addressPill: {
    background: C.mintDim, border: `0.5px solid ${C.mintBorder}`, borderRadius: '6px',
    padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px',
    width: '100%', maxWidth: '600px', margin: '0 auto',
  },
  dot: {
    width: '8px', height: '8px', borderRadius: '50%', background: C.mint,
    boxShadow: `0 0 6px ${C.mint}`, flexShrink: 0, animation: 'pulse-dot 2s ease-in-out infinite',
  },
  addressText: { color: C.mint, fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px', wordBreak: 'break-all', flex: 1 },
  networkLabel: { color: C.textDim, fontSize: '12px', letterSpacing: '0.3px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  candidateCard: {
    background: C.bgCard2, border: `0.5px solid ${C.border}`, borderRadius: '8px',
    padding: '28px 20px', textAlign: 'center', transition: 'all 0.2s ease', cursor: 'pointer',
    boxShadow: '0px 4px 34px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden',
  },
  candidateCardHover: {
    border: `0.5px solid ${C.goldBorder}`,
    boxShadow: `0px 4px 34px rgba(0,0,0,0.5), 0 0 20px ${C.goldDim}`,
  },
  candidateCardTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
    background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
    opacity: 0, transition: 'opacity 0.2s ease',
  },
  candidateImg: {
    width: '136px', height: '136px', borderRadius: '50%', objectFit: 'cover',
    display: 'block', margin: '0 auto 18px',
    border: `2px solid rgba(23,235,189,0.2)`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
    filter: 'grayscale(20%)',
    transition: 'filter 0.2s ease, border-color 0.2s ease',
  },
  candidateImgHover: {
    filter: 'grayscale(0%)',
    borderColor: 'rgba(239,186,50,0.6)',
  },
  candidateName:       { fontSize: '13px', fontWeight: '600', color: C.text, marginBottom: '16px', letterSpacing: '0.5px', textTransform: 'uppercase' },
  candidateVotes:      { fontSize: '36px', fontWeight: '800', color: C.gold, marginBottom: '2px', lineHeight: '1', textShadow: `0 0 20px ${C.goldGlow}` },
  candidateVotesLabel: { fontSize: '10px', color: C.textDim, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' },
  progressWrap:        { width: '100%', height: '3px', background: 'rgba(217,217,217,0.07)', borderRadius: '2px', overflow: 'hidden', marginBottom: '6px' },
  progressPct:         { fontSize: '10px', color: C.textDim, letterSpacing: '0.5px', textAlign: 'right', marginBottom: '16px' },
  voteBtn: {
    background: C.mintDim, border: `0.5px solid ${C.mintBorder}`, color: C.mint,
    padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
    cursor: 'pointer', width: '100%', transition: 'all 0.2s ease', letterSpacing: '0.5px',
    fontFamily: "'JetBrains Mono', monospace",
  },
  voteBtnDisabled:     { opacity: 0.35, cursor: 'not-allowed' },
  connectToVote: {
    display: 'block', width: '100%', marginTop: '12px',
    background: 'rgba(217,217,217,0.06)', border: `0.5px solid ${C.border}`,
    borderRadius: '4px', padding: '12px 16px',
    color: C.textMuted, fontSize: '13px', fontWeight: '600',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.5px', lineHeight: '1.5',
    textAlign: 'center', cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  txBanner: {
    background: C.mintDim, border: `0.5px solid ${C.mintBorder}`, borderRadius: '6px',
    padding: '13px 20px', color: C.textMuted, fontSize: '12px', marginTop: '16px',
    letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
  },
  error: {
    background: C.errorDim, border: `0.5px solid ${C.errorBorder}`, borderRadius: '6px',
    padding: '12px 20px', color: C.error, fontSize: '13px', marginTop: '16px',
    textAlign: 'center', letterSpacing: '0.3px',
  },
  success: {
    background: C.successDim, border: `0.5px solid ${C.successBorder}`, borderRadius: '6px',
    padding: '12px 20px', color: C.success, fontSize: '13px', marginTop: '16px',
    textAlign: 'center', letterSpacing: '0.3px',
  },
  eventBanner: {
    background: C.mintDim, border: `0.5px solid ${C.mintBorder}`, borderRadius: '6px',
    padding: '12px 20px', color: C.textMuted, fontSize: '12px', display: 'flex',
    alignItems: 'center', gap: '10px', letterSpacing: '0.3px', marginTop: '16px',
  },
  // ── Pédagogie ──────────────────────────────────────────────────────────────
  pedagogy: {
    background: 'rgba(2,152,142,0.07)',
    borderLeft: `3px solid ${C.teal}`,
    borderRadius: '0 4px 4px 0',
    padding: '12px 16px',
    color: C.textMuted,
    fontSize: '11px',
    lineHeight: '1.8',
    letterSpacing: '0.3px',
    fontStyle: 'italic',
  },
  // ── Contract info links ────────────────────────────────────────────────────
  contractLink: {
    background: C.mintDim, border: `0.5px solid ${C.mintBorder}`, color: C.mint,
    padding: '7px 14px', borderRadius: '4px', fontSize: '11px', textDecoration: 'none',
    letterSpacing: '0.5px', display: 'inline-block', transition: 'all 0.2s ease',
    fontFamily: "'JetBrains Mono', monospace",
  },
  // ── Explorer ───────────────────────────────────────────────────────────────
  explorerHeader:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  explorerToggleBtn: {
    background: 'transparent', border: `0.5px solid ${C.border}`, color: C.textMuted,
    padding: '7px 16px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.5px', transition: 'all 0.2s ease',
  },
  tableWrapper:      { overflowX: 'auto', marginTop: '16px' },
  explorerTable:     { width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", minWidth: '1300px', tableLayout: 'fixed' },
  explorerTh: {
    textAlign: 'left', padding: '8px 12px', color: C.textDim, fontSize: '10px',
    letterSpacing: '1px', textTransform: 'uppercase', borderBottom: `0.5px solid ${C.border}`, fontWeight: '600',
  },
  explorerTd:    { padding: '10px 12px', borderBottom: `0.5px solid rgba(23,235,189,0.06)`, color: C.textMuted, verticalAlign: 'middle', whiteSpace: 'nowrap' },
  explorerEmpty: { textAlign: 'center', padding: '32px', color: C.textDim, fontSize: '12px', letterSpacing: '0.3px' },
  spinner: {
    display: 'inline-block', width: '14px', height: '14px',
    border: `2px solid ${C.mintBorder}`, borderTopColor: C.mint,
    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
    verticalAlign: 'middle', marginRight: '8px',
  },
  // ── Accordion ──────────────────────────────────────────────────────────────
  accordionItem:   { borderBottom: `0.5px solid ${C.border}` },
  accordionBtn: {
    width: '100%', background: 'transparent', border: 'none', padding: '16px 0',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    cursor: 'pointer', color: C.text, fontSize: '13px',
    fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.3px', textAlign: 'left', gap: '12px',
  },
  accordionContent: { padding: '0 0 18px 0', color: C.textMuted, fontSize: '12px', lineHeight: '1.9', letterSpacing: '0.3px', fontWeight: '300' },
  // ── Modal ──────────────────────────────────────────────────────────────────
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(8,18,19,0.93)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
  },
  modalBox: {
    background: '#081e20', border: `0.5px solid ${C.mintBorder}`, borderRadius: '8px',
    width: '100%', maxWidth: '700px', maxHeight: '88vh',
    display: 'flex', flexDirection: 'column',
    boxShadow: `0 0 80px rgba(23,235,189,0.08)`,
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '22px 28px', borderBottom: `0.5px solid ${C.border}`, flexShrink: 0,
  },
  modalTitle: {
    fontSize: '13px', fontWeight: '700', color: C.mint,
    letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace",
  },
  modalCloseBtn: {
    background: 'transparent', border: `0.5px solid ${C.border}`, color: C.textMuted,
    padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px',
    fontFamily: "'JetBrains Mono', monospace", transition: 'all 0.2s ease',
  },
  modalBody:   { padding: '24px 28px', overflowY: 'auto', flex: 1 },
  modalRow:    { borderBottom: `0.5px solid ${C.border}`, paddingBottom: '16px', marginBottom: '16px' },
  modalLabel:  { fontSize: '10px', color: C.textDim, letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '6px', fontFamily: "'JetBrains Mono', monospace" },
  modalValue:  { fontSize: '12px', color: C.textMuted, fontFamily: "'JetBrains Mono', monospace", wordBreak: 'break-all', lineHeight: '1.6' },
  modalNav: {
    display: 'flex', justifyContent: 'space-between', padding: '18px 28px',
    borderTop: `0.5px solid ${C.border}`, flexShrink: 0, gap: '12px',
  },
  modalNavBtn: {
    background: C.mintDim, border: `0.5px solid ${C.mintBorder}`, color: C.mint,
    padding: '9px 20px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.5px', transition: 'all 0.2s ease',
  },
  footer: {
    marginTop: '60px', color: C.textDim, fontSize: '11px', textAlign: 'center',
    letterSpacing: '0.5px', borderTop: `0.5px solid ${C.border}`, paddingTop: '20px',
    width: '100%', maxWidth: '1200px',
  },
}

// ─── Static data ──────────────────────────────────────────────────────────────
const CANDIDATE_NAMES = ['Léon Blum', 'Jacques Chirac', 'François Mitterrand']
const CANDIDATE_IMGS  = [imgLeonBlum, imgChirac, imgMitterrand]

const ACCORDION_ITEMS = [
  {
    title: '① Connexion MetaMask',
    content: "MetaMask est votre identité sur la blockchain. Quand vous cliquez 'Connecter', MetaMask expose votre adresse publique (0x...) à l'application. Cette adresse est votre identifiant unique — il n'y a pas de login, pas de mot de passe, pas de serveur. La clé privée ne quitte jamais MetaMask.",
  },
  {
    title: '② Signer une transaction',
    content: "Voter = envoyer une transaction à un smart contract. MetaMask calcule le hash de cette transaction, le signe avec votre clé privée (algorithme ECDSA), et diffuse la transaction signée sur le réseau Ethereum. Le réseau vérifie la signature — sans jamais voir votre clé privée — et confirme que c'est bien vous qui avez voté.",
  },
  {
    title: '③ Confirmation on-chain',
    content: "Une fois signée, la transaction entre dans le mempool — la file d'attente des transactions en attente. Un validateur la sélectionne et l'inclut dans un bloc. Sur Ethereum Sepolia, ça prend ~12 secondes. Après ~12,8 minutes (2 époques), le bloc est finalisé : le vote est irréversible, public, et vérifiable par tous sur Etherscan.",
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function Spinner() {
  return <span style={S.spinner} />
}

function TxStatusBanner({ status }) {
  if (!status) return null
  const steps = {
    1: { icon: '⏳', label: 'Signature dans MetaMask...' },
    2: { icon: '📡', label: 'Transaction envoyée — hash :' },
    3: { icon: '⏱', label: 'En attente de confirmation (~12 secondes)...' },
    4: { icon: '✅', label: 'Incluse dans le bloc' },
  }
  const m = steps[status.step]
  return (
    <div style={{ ...S.txBanner, flexWrap: 'wrap' }}>
      <span>{m.icon}</span>
      <span style={{ color: C.textMuted }}>{m.label}</span>
      {(status.step === 2 || status.step === 3) && status.hash && (
        <span style={{ fontFamily: 'monospace', color: C.mint, fontSize: '11px', wordBreak: 'break-all', flex: '1 1 100%' }}>{status.hash}</span>
      )}
      {status.step === 4 && status.blockNumber && (
        <span style={{ color: C.gold }}>#{status.blockNumber}</span>
      )}
    </div>
  )
}

function DataRow({ label, value, link, highlight, last }) {
  return (
    <div style={{ ...S.modalRow, ...(last ? { borderBottom: 'none', marginBottom: 0, paddingBottom: 0 } : {}) }}>
      <div style={S.modalLabel}>{label}</div>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer"
          style={{ ...S.modalValue, color: C.mint, textDecoration: 'none' }}>
          {value}
        </a>
      ) : (
        <div style={{ ...S.modalValue, ...(highlight ? { color: highlight } : {}) }}>{value}</div>
      )}
    </div>
  )
}

function BlockModal({ data, loading, onClose, onNavigate, minBlock, maxBlock }) {
  const [showExtra, setShowExtra] = useState(false)
  if (!data) return null
  const { event, block } = data
  const fmt    = (ts) => ts != null ? new Date(ts * 1000).toLocaleString('fr-FR') : '—'
  const fmtNum = (n)  => n  != null ? Number(n).toLocaleString('fr-FR') : '—'
  const canPrev = block?.number != null && minBlock != null && block.number > minBlock
  const canNext = block?.number != null && maxBlock != null && block.number < maxBlock
  const navDisabled = {
    opacity: 0.35, cursor: 'not-allowed', pointerEvents: 'none',
    background: 'rgba(74,107,111,0.12)', border: `0.5px solid rgba(74,107,111,0.2)`,
    color: '#4a6b6f',
  }

  return (
    <div style={S.modalOverlay} onClick={onClose}>
      <div style={S.modalBox} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={S.modalHeader}>
          <div style={S.modalTitle}>BLOC #{block?.number ?? '...'} — Vue détaillée</div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {block?.number != null && (
              <a href={`https://sepolia.etherscan.io/block/${block.number}`}
                target="_blank" rel="noopener noreferrer"
                style={{ ...S.modalCloseBtn, color: C.mint, textDecoration: 'none', display: 'inline-block', cursor: 'pointer' }}>
                🔍 Etherscan
              </a>
            )}
            <button style={S.modalCloseBtn} onClick={onClose}>✕ Fermer</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: C.textDim, fontSize: '12px' }}>
            <Spinner /> Chargement du bloc...
          </div>
        ) : (
          <div style={S.modalBody}>
            {event ? (
              <>
                <DataRow label="Transaction Hash"
                  value={event?.hash ?? '—'}
                  link={event?.hash ? `https://sepolia.etherscan.io/tx/${event.hash}` : null} />
                <DataRow label="Votant"        value={event?.voter ?? '—'} />
                <DataRow label="Candidat voté" value={event?.candidateName ?? '—'} highlight={C.gold} />
                <DataRow label="Gas (tx)"      value={event?.gasUsed != null ? `${fmtNum(event.gasUsed)} unités` : '—'} />
              </>
            ) : (
              <div style={{ ...S.modalValue, color: C.textDim, marginBottom: '16px', fontStyle: 'italic' }}>
                Aucun vote enregistré dans ce bloc.
              </div>
            )}
            <DataRow label="Numéro de bloc" value={block?.number != null ? `#${block.number}` : '—'} />
            <DataRow label="Timestamp"      value={fmt(block?.timestamp)} />
            <DataRow label="parentHash"     value={block?.parentHash ?? '—'} />

            {/* Toggle extra block info */}
            <button
              onClick={() => setShowExtra(s => !s)}
              className="explorer-toggle-btn"
              style={{ ...S.explorerToggleBtn, marginTop: '12px', marginBottom: showExtra ? '16px' : '0' }}>
              {showExtra ? '▴ Masquer les détails' : '▾ Plus d\'infos sur ce bloc'}
            </button>

            {showExtra && (
              <>
                <DataRow label="gasLimit (bloc)"  value={block?.gasLimit != null ? `${fmtNum(block.gasLimit)} unités` : '—'} />
                <DataRow label="gasUsed (bloc)"   value={block?.gasUsedBlock != null ? `${fmtNum(block.gasUsedBlock)} unités` : '—'} />
                <DataRow label="Validateur (miner)" value={block?.miner ?? '—'} last />
              </>
            )}

            {/* Encart pédagogique */}
            <div style={{ ...S.pedagogy, marginTop: '24px' }}>
              🔐 Le parentHash est le hash du bloc précédent. C'est ce lien cryptographique qui rend la blockchain immuable : modifier ce bloc changerait son hash, invalidant le parentHash du bloc suivant, cassant toute la chaîne jusqu'au bout.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={S.modalNav}>
          <button
            style={{ ...S.modalNavBtn, ...(!canPrev ? navDisabled : {}) }}
            onClick={() => canPrev && onNavigate(-1)}
            disabled={!canPrev}
          >← Bloc précédent</button>
          <button
            style={{ ...S.modalNavBtn, ...(!canNext ? navDisabled : {}) }}
            onClick={() => canNext && onNavigate(+1)}
            disabled={!canNext}
          >Bloc suivant →</button>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
function App() {
  const [account, setAccount]                 = useState(null)
  const [provider, setProvider]               = useState(null)
  const [candidates, setCandidates]           = useState([])
  const [isVoting, setIsVoting]               = useState(false)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const [error, setError]                     = useState(null)
  const [lastEvent, setLastEvent]             = useState(null)
  const [hoveredId, setHoveredId]             = useState(null)
  const [txStatus, setTxStatus]               = useState(null)
  const [txHash, setTxHash]                   = useState(null)
  const [txGasUsed, setTxGasUsed]             = useState(null)
  const [explorerOpen, setExplorerOpen]       = useState(false)
  const [explorerEvents, setExplorerEvents]   = useState([])
  const [explorerLoading, setExplorerLoading] = useState(false)
  const [openAccordions, setOpenAccordions]   = useState({})
  const [modalData, setModalData]             = useState(null)
  const [modalLoading, setModalLoading]       = useState(false)
  const connectRef = useRef(null)

  // ── Chargement initial sans MetaMask ─────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return
      try {
        const p = new BrowserProvider(window.ethereum)
        setProvider(p)
        await loadCandidates(p)
      } catch { /* silent */ }
    }
    init()
  }, [])

  // ── Wallet connection ────────────────────────────────────────────────────────
  const connectWallet = async () => {
    try {
      if (!window.ethereum) { setError("MetaMask n'est pas installé."); return }
      const _provider = new BrowserProvider(window.ethereum)
      await _provider.send("eth_requestAccounts", [])
      const network = await _provider.getNetwork()
      if (network.chainId !== BigInt(EXPECTED_CHAIN_ID)) {
        setError(`Mauvais réseau — connectez MetaMask sur ${EXPECTED_NETWORK_NAME}.`)
        return
      }
      const signer = await _provider.getSigner()
      const address = await signer.getAddress()
      setAccount(address)
      setProvider(_provider)
      setError(null)
      await loadCandidates(_provider)
    } catch { setError("Connexion refusée.") }
  }

  // ── Load candidates ──────────────────────────────────────────────────────────
  const loadCandidates = async (_provider) => {
    const c = new Contract(CONTRACT_ADDRESS, ABI, _provider)
    const count = await c.getCandidatesCount()
    const list = []
    for (let i = 0; i < Number(count); i++) {
      const [name, voteCount] = await c.getCandidate(i)
      list.push({ id: i, name, votes: Number(voteCount) })
    }
    setCandidates(list)
  }

  // ── Load explorer events ──────────────────────────────────────────────────────
  const loadExplorerEvents = async (_provider) => {
    const p = _provider || provider
    if (!p) return
    setExplorerLoading(true)
    try {
      const ec = new Contract(CONTRACT_ADDRESS, ABI, p)
      const raw = await ec.queryFilter(ec.filters.Voted(), -1000)
      const last20 = raw.slice(-20).reverse()
      const enriched = await Promise.all(last20.map(async (e) => {
        let timestamp = null, parentHash = null, gasUsed = null
        let gasLimit = null, miner = null, gasUsedBlock = null
        const idx = Number(e.args.candidateIndex)
        const candidateName = CANDIDATE_NAMES[idx] ?? `Candidat #${idx}`
        try {
          const block = await p.getBlock(e.blockNumber)
          timestamp    = block?.timestamp  ?? null
          parentHash   = block?.parentHash ?? null
          gasLimit     = block?.gasLimit   != null ? Number(block.gasLimit) : null
          miner        = block?.miner      ?? null
          gasUsedBlock = block?.gasUsed    != null ? Number(block.gasUsed)  : null
        } catch { /* silent */ }
        try {
          const receipt = await p.getTransactionReceipt(e.transactionHash)
          gasUsed = receipt?.gasUsed != null ? Number(receipt.gasUsed) : null
        } catch { /* silent */ }
        return {
          hash: e.transactionHash,
          blockNumber: e.blockNumber,
          voter: e.args.voter,
          candidateIndex: idx,
          candidateName,
          timestamp,
          parentHash,
          gasUsed,
          gasLimit,
          miner,
          gasUsedBlock,
        }
      }))
      setExplorerEvents(enriched)
    } catch {
      setExplorerEvents([])
    } finally {
      setExplorerLoading(false)
    }
  }

  // ── Vote ──────────────────────────────────────────────────────────────────────
  const vote = async (candidateId) => {
    try {
      setIsVoting(true)
      setError(null)
      setTxStatus({ step: 1 })
      const signer = await provider.getSigner()
      const voteContract = new Contract(CONTRACT_ADDRESS, ABI, signer)
      const secondsLeft = Number(await voteContract.getTimeUntilNextVote(account))
      if (secondsLeft > 0) {
        setCooldownSeconds(secondsLeft)
        setIsVoting(false)
        setTxStatus(null)
        return
      }
      const tx = await voteContract.vote(candidateId)
      setTxHash(tx.hash)
      setTxStatus({ step: 2, hash: tx.hash })
      setTxStatus({ step: 3, hash: tx.hash })
      const receipt = await tx.wait()
      setTxGasUsed(Number(receipt.gasUsed))
      setTxStatus({ step: 4, hash: tx.hash, blockNumber: receipt.blockNumber })
      await loadCandidates(provider)
      if (explorerOpen) loadExplorerEvents()
      setCooldownSeconds(3 * 60)
    } catch (err) {
      setTxStatus(null)
      setError(err.code === 4001 ? "Transaction annulée." : "Erreur : " + err.message)
    } finally {
      setIsVoting(false)
    }
  }

  // ── Listen to on-chain events ─────────────────────────────────────────────────
  useEffect(() => {
    if (!provider) return
    let listenContract
    try {
      listenContract = new Contract(CONTRACT_ADDRESS, ABI, provider)
      const handler = (voter, candidateIndex) => {
        const idx = Number(candidateIndex)
        setLastEvent({
          voter: voter.slice(0, 6) + '...' + voter.slice(-4),
          candidateName: CANDIDATE_NAMES[idx] ?? `Candidat #${idx}`,
        })
        loadCandidates(provider)
      }
      listenContract.on("Voted", handler)
      return () => { listenContract.off("Voted", handler) }
    } catch (err) {
      console.warn("Impossible d'écouter les events :", err.message)
    }
  }, [provider])

  // ── Load explorer when opened ─────────────────────────────────────────────────
  useEffect(() => {
    if (explorerOpen && provider) loadExplorerEvents()
  }, [explorerOpen])

  // ── Cooldown countdown ────────────────────────────────────────────────────────
  useEffect(() => {
    if (cooldownSeconds <= 0) return
    const timer = setInterval(() => {
      setCooldownSeconds(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldownSeconds])

  // ── Modal helpers ─────────────────────────────────────────────────────────────
  const openModal = (event) => {
    setModalData({
      event,
      block: {
        number: event.blockNumber,
        parentHash: event.parentHash,
        timestamp: event.timestamp,
        gasLimit: event.gasLimit,
        miner: event.miner,
        gasUsedBlock: event.gasUsedBlock,
      },
    })
  }

  const navigateModal = async (direction) => {
    if (modalData?.block?.number == null) return
    const targetNum = modalData.block.number + direction
    setModalLoading(true)
    try {
      const block = await provider.getBlock(targetNum)
      const matchingEvent = explorerEvents.find(e => e.blockNumber === targetNum) || null
      setModalData({
        event: matchingEvent,
        block: {
          number: block.number,
          parentHash: block.parentHash,
          timestamp: block.timestamp,
          gasLimit: block.gasLimit != null ? Number(block.gasLimit) : null,
          miner: block.miner ?? null,
          gasUsedBlock: block.gasUsed != null ? Number(block.gasUsed) : null,
        },
      })
    } catch { /* silent */ }
    finally { setModalLoading(false) }
  }

  // ── Derived ───────────────────────────────────────────────────────────────────
  const totalVotes      = candidates.reduce((s, c) => s + c.votes, 0)
  const toggleAccordion = (i) => setOpenAccordions(prev => ({ ...prev, [i]: !prev[i] }))
  const fmt             = (ts) => ts != null ? new Date(ts * 1000).toLocaleString('fr-FR') : '—'
  const minExplorerBlock = explorerEvents.length > 0 ? Math.min(...explorerEvents.map(e => e.blockNumber)) : null
  const maxExplorerBlock = explorerEvents.length > 0 ? Math.max(...explorerEvents.map(e => e.blockNumber)) : null

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>

      {/* ── Nav ── */}
      <nav style={S.nav}>
        <div style={S.logo}>dApp<span style={S.logoDot}>.</span>Vote</div>
        <span style={S.badge}>⬡ Sepolia Testnet</span>
      </nav>

      {/* ── Hero ── */}
      <div style={S.hero}>
        <div style={S.tag}>⛓ Live on Ethereum</div>
        <h1 style={S.h1}>Vote décentralisé<br />sans intermédiaire</h1>
        <p style={S.subtitle}>
          Chaque vote est une transaction signée sur la blockchain Ethereum.<br />
          Transparent, immuable, vérifiable par tous.
        </p>
      </div>

      {/* ── Wallet ── */}
      <div style={S.card} ref={connectRef}>
        <div style={S.cardTitle}><span style={S.cardTitleAccent} />Wallet</div>
        {!account ? (
          <button style={S.connectBtn} onClick={connectWallet}>
            <span>🦊</span> Connecter MetaMask
          </button>
        ) : (
          <div style={S.addressPill}>
            <div style={S.dot} />
            <span style={S.addressText}>{account}</span>
            <span style={S.networkLabel}>· {EXPECTED_NETWORK_NAME}</span>
          </div>
        )}
        {error && <div style={S.error}>⚠ {error}</div>}
      </div>

      {/* ── Amélioration 3 : Infos contrat ── */}
      <div style={S.card}>
        <div style={S.cardTitle}>
          <span style={S.cardTitleAccent} />
          📄 Smart Contract déployé sur Ethereum Sepolia
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", color: C.mint, fontSize: '12px', marginBottom: '16px', wordBreak: 'break-all', letterSpacing: '0.3px' }}>
          {CONTRACT_ADDRESS}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <a href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" style={S.contractLink}>
            🔍 Voir le contrat
          </a>
          <a href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}#transactions`} target="_blank" rel="noopener noreferrer" style={S.contractLink}>
            📋 Transactions
          </a>
          <a href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}#events`} target="_blank" rel="noopener noreferrer" style={S.contractLink}>
            ⚡ Events
          </a>
        </div>
        <p style={{ color: C.textMuted, fontSize: '12px', lineHeight: '1.9', letterSpacing: '0.3px', fontWeight: '300' }}>
          Ce contrat est déployé de façon permanente sur Ethereum Sepolia. Son code ne peut plus être modifié — c'est l'immuabilité de la blockchain. Chaque vote appelle la fonction <span style={{ color: C.mint }}>vote(candidateIndex)</span> qui vérifie que vous n'avez pas déjà voté via <span style={{ color: C.mint }}>require(!hasVoted[msg.sender])</span>, incrémente le compteur du candidat, et émet un event <span style={{ color: C.gold }}>Voted</span> enregistré de façon permanente dans les logs de la transaction.
        </p>
      </div>

      {/* ── Accordéon "Comment ça marche" ── */}
      <div style={S.card}>
        <div style={{ ...S.cardTitle, marginBottom: '8px' }}>
          <span style={S.cardTitleAccent} />
          💡 Comment fonctionne ce vote on-chain ?
        </div>
        {ACCORDION_ITEMS.map((item, i) => (
          <div key={i} style={{ ...S.accordionItem, ...(i === ACCORDION_ITEMS.length - 1 ? { borderBottom: 'none' } : {}) }}>
            <button style={S.accordionBtn} onClick={() => toggleAccordion(i)}>
              <span>{item.title}</span>
              <span style={{
                color: C.mint, fontSize: '14px', transition: 'transform 0.3s ease',
                transform: openAccordions[i] ? 'rotate(180deg)' : 'rotate(0deg)',
                display: 'inline-block', flexShrink: 0,
              }}>▾</span>
            </button>
            <div className="accordion-body" style={{ maxHeight: openAccordions[i] ? '300px' : '0px' }}>
              <p style={S.accordionContent}>{item.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Candidats ── */}
      {candidates.length > 0 && (
        <div style={S.card}>
          <div style={S.cardTitle}>
            <span style={S.cardTitleAccent} />
            Candidats
            <span style={{ marginLeft: 'auto', color: C.textMuted, fontSize: '11px', fontWeight: '400' }}>
              {totalVotes} vote{totalVotes !== 1 ? 's' : ''} enregistré{totalVotes !== 1 ? 's' : ''}
            </span>
          </div>

          <div style={S.grid}>
            {candidates.map((c) => {
              const hovered = hoveredId === c.id
              const pct = totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0
              return (
                <div key={c.id}
                  style={{ ...S.candidateCard, ...(hovered ? S.candidateCardHover : {}) }}
                  onMouseEnter={() => setHoveredId(c.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div style={{ ...S.candidateCardTop, opacity: hovered ? 1 : 0 }} />
                  <img
                    src={CANDIDATE_IMGS[c.id]}
                    alt={c.name}
                    style={{ ...S.candidateImg, ...(hovered ? S.candidateImgHover : {}) }}
                  />
                  <div style={S.candidateName}>{c.name}</div>
                  <div style={S.candidateVotes}>{c.votes}</div>
                  <div style={S.candidateVotesLabel}>votes</div>

                  <div style={S.progressWrap}>
                    <div style={{
                      height: '100%', width: `${pct}%`,
                      background: `linear-gradient(90deg, ${C.teal}, ${C.mint})`,
                      borderRadius: '2px', transition: 'width 0.6s ease',
                      boxShadow: pct > 0 ? `0 0 8px ${C.mintGlow}` : 'none',
                    }} />
                  </div>
                  <div style={S.progressPct}>{pct}%</div>

                  {!account ? (
                    <button
                      className="connect-to-vote-btn"
                      style={S.connectToVote}
                      onClick={() => connectRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    >🦊 Connectez-vous pour voter</button>
                  ) : cooldownSeconds === 0 ? (
                    <button
                      className="vote-btn"
                      style={{ ...S.voteBtn, ...(isVoting ? S.voteBtnDisabled : {}) }}
                      onClick={() => vote(c.id)}
                      disabled={isVoting}
                    >
                      {isVoting ? '⏳ En cours...' : 'Voter →'}
                    </button>
                  ) : null}
                </div>
              )
            })}
          </div>

          {/* Tx status */}
          {txStatus && (isVoting || txStatus.step === 4) && (
            <TxStatusBanner status={txStatus} />
          )}

          {/* Encart pédagogique 2 — après vote confirmé */}
          {txStatus?.step === 4 && txStatus.blockNumber && (
            <div style={{ ...S.pedagogy, marginTop: '12px' }}>
              ⛓ Votre transaction a été incluse dans le bloc{' '}
              <span style={{ color: C.gold }}>#{txStatus.blockNumber}</span>.
              Elle est maintenant permanente sur Ethereum Sepolia.
              {txGasUsed != null && (
                <> gasUsed = <span style={{ color: C.mint }}>{txGasUsed.toLocaleString('fr-FR')} unités</span> — c'est le coût computationnel de l'exécution de vote() sur l'EVM.</>
              )}
            </div>
          )}

          {/* Succès */}
          {txStatus?.step === 4 && (
            <div style={S.success}>✓ Vote enregistré sur la blockchain Ethereum</div>
          )}

          {/* Cooldown */}
          {cooldownSeconds > 0 && (
            <div style={{
              background: 'rgba(20,184,166,0.06)',
              border: '1px solid rgba(20,184,166,0.2)',
              borderRadius: '12px',
              padding: '16px 24px',
              marginTop: '16px',
              textAlign: 'center',
            }}>
              <div style={{ color: '#14b8a6', fontSize: '13px', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                ⏳ Prochain vote disponible dans
              </div>
              <div style={{ color: '#f0fdfc', fontSize: '32px', fontWeight: '800', fontFamily: 'monospace' }}>
                {String(Math.floor(cooldownSeconds / 60)).padStart(2, '0')}:{String(cooldownSeconds % 60).padStart(2, '0')}
              </div>
              <div style={{ color: '#4b6b6e', fontSize: '12px', marginTop: '8px' }}>
                La blockchain enregistre l'heure de votre dernier vote via block.timestamp
              </div>
            </div>
          )}

          {/* Lien Etherscan */}
          {txStatus?.step === 4 && txHash && (
            <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
              className="etherscan-link"
              style={{ display: 'block', color: C.mint, fontSize: '12px', textDecoration: 'none', marginTop: '10px', textAlign: 'center', letterSpacing: '0.3px', opacity: 0.75, transition: 'opacity 0.2s ease' }}>
              🔍 Voir la transaction sur Etherscan →
            </a>
          )}

          {/* Dernier event live */}
          {lastEvent && (
            <div style={S.eventBanner}>
              <span style={{ color: C.mint }}>⚡</span>
              <span>
                Nouveau vote —{' '}
                <strong style={{ color: C.mint }}>{lastEvent.voter}</strong>
                {' '}→{' '}
                <strong style={{ color: C.gold }}>{lastEvent.candidateName}</strong>
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Blockchain Explorer ── */}
      <div style={S.card}>
        <div style={S.explorerHeader}>
          <div style={{ ...S.cardTitle, marginBottom: 0 }}>
            <span style={S.cardTitleAccent} />
            ⛓ Blockchain Explorer
          </div>
          <button className="explorer-toggle-btn" style={S.explorerToggleBtn}
            onClick={() => setExplorerOpen(o => !o)}>
            {explorerOpen ? 'Masquer' : 'Afficher'}
          </button>
        </div>

        <div style={{ maxHeight: explorerOpen ? '800px' : '0px', overflow: 'hidden', transition: 'max-height 0.4s ease' }}>

          {/* Encart pédagogique 1 */}
          <div style={{ ...S.pedagogy, marginTop: '20px', marginBottom: '4px' }}>
            📚 Ce que vous voyez ici est l'historique immuable des transactions enregistrées on-chain. Chaque ligne est un bloc Ethereum contenant votre vote. Le parentHash relie chaque bloc au précédent — modifier un bloc invaliderait toute la chaîne. C'est le mécanisme d'immuabilité vu en cours.
          </div>

          {explorerLoading ? (
            <div style={{ textAlign: 'center', padding: '32px', color: C.textDim, fontSize: '12px' }}>
              <Spinner /> Chargement des données on-chain...
            </div>
          ) : explorerEvents.length === 0 ? (
            <div style={S.explorerEmpty}>Aucun vote enregistré sur la blockchain pour l'instant.</div>
          ) : (
            <div style={S.tableWrapper}>
              <table style={S.explorerTable}>
                <thead>
                  <tr>
                    <th style={{ ...S.explorerTh, width: '44%' }}>Tx Hash</th>
                    <th style={{ ...S.explorerTh, width: '8%'  }}>Bloc</th>
                    <th style={{ ...S.explorerTh, width: '22%' }}>Votant</th>
                    <th style={{ ...S.explorerTh, width: '12%' }}>Candidat</th>
                    <th style={{ ...S.explorerTh, width: '14%', fontSize: '8.5px' }}>Heure</th>
                  </tr>
                </thead>
                <tbody>
                  {explorerEvents.map((e, i) => (
                    <tr key={i} className="explorer-tr"
                      onClick={() => openModal(e)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ ...S.explorerTd, fontFamily: 'monospace', fontSize: '10.5px', color: C.mint, letterSpacing: '0.2px' }}>
                        {e.hash}
                      </td>
                      <td style={S.explorerTd}>
                        <a href={`https://sepolia.etherscan.io/block/${e.blockNumber}`}
                          target="_blank" rel="noopener noreferrer"
                          onClick={ev => ev.stopPropagation()}
                          style={{ color: C.textMuted, textDecoration: 'none' }}>
                          {e.blockNumber}
                        </a>
                      </td>
                      <td style={{ ...S.explorerTd, fontSize: '10px' }}>
                        {e.voter.slice(0, 10)}...{e.voter.slice(-6)}
                      </td>
                      <td style={{ ...S.explorerTd, color: C.gold }}>{e.candidateName}</td>
                      <td style={{ ...S.explorerTd, color: C.textDim, fontSize: '8.5px', letterSpacing: '0' }}>
                        {fmt(e.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={S.footer}>
        Contrat déployé sur Ethereum Sepolia
        &nbsp;·&nbsp;
        <span style={{ color: C.mint }}>{CONTRACT_ADDRESS}</span>
      </footer>

      {/* ── Modal bloc ── */}
      <BlockModal
        data={modalData}
        loading={modalLoading}
        onClose={() => { setModalData(null); setModalLoading(false) }}
        onNavigate={navigateModal}
        minBlock={minExplorerBlock}
        maxBlock={maxExplorerBlock}
      />

    </div>
  )
}

export default App
