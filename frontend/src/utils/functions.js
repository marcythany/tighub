export function formatMemberSince(inputDateString) {
  const options = { month: 'short', day: '2-digit', year: 'numeric' };
  const formattedDate = new Date(inputDateString).toLocaleDateString(
    'pt-BR',
    options,
  );
  return formattedDate;
}

export function formatDate(inputDateString) {
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const date = new Date(inputDateString);
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // Function to add ordinal suffix to day
  function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) {
      return day + 'th';
    }
    switch (day % 10) {
      case 1:
        return day + 'st';
      case 2:
        return day + 'nd';
      case 3:
        return day + 'rd';
      default:
        return day + 'th';
    }
  }

  const formattedDate = `${monthName} ${getOrdinalSuffix(day)}, ${year}`;
  return formattedDate;
}
