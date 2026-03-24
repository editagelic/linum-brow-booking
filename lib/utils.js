export const MONTHS_HR = [
  'Januar','Februar','Mart','April','Maj','Juni','Juli',
  'August','Septembar','Oktobar','Novembar','Decembar'
]

export const DAYS_SHORT = ['Pon','Uto','Sri','Čet','Pet','Sub','Ned']
export const DAYS_FULL  = [
  'Ponedjeljak','Utorak','Srijeda','Četvrtak','Petak','Subota','Nedjelja'
]

export function fmtKey(d) {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0')
}

export function formatDateHr(dateStr, timeStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const dow = d.getDay()
  const dowIdx = dow === 0 ? 6 : dow - 1
  return DAYS_FULL[dowIdx] + ', ' + d.getDate() + '. ' +
    MONTHS_HR[d.getMonth()].toLowerCase() + ' ' +
    d.getFullYear() + '. u ' + timeStr
}

export function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const dow = d.getDay()
  const dowIdx = dow === 0 ? 6 : dow - 1
  return DAYS_FULL[dowIdx] + ', ' + d.getDate() + '. ' +
    MONTHS_HR[d.getMonth()].toLowerCase() + ' ' + d.getFullYear() + '.'
}