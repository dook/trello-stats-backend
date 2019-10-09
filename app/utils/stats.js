export const nextStatsObject = (currentStatsObj, members) => {
  const newStatsObj = { ...currentStatsObj }
  members.forEach(cardMember => {
    newStatsObj[cardMember.id] = newStatsObj[cardMember.id] ? newStatsObj[cardMember.id] + 1 : 1
  })
  return newStatsObj
}

export const isCardDone = (card, doneList) => card.dueComplete || doneList.indexOf(card.idList) !== -1

export const isCardUndone = (card, undoneList) =>
    undoneList.indexOf(card.idList) !== -1
    || (!card.dueComplete && card.due && new Date(card.due).getMilliseconds() < new Date().getMilliseconds())
