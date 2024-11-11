export function formatMemberSince(inputDateString) {
  const options = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  };

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

  // Formato brasileiro: dia de mês de ano
  const formattedDate = `${day} de ${monthName} de ${year}`;
  return formattedDate;
}

// Função adicional para formato mais curto
export function formatDateShort(inputDateString) {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  return new Date(inputDateString).toLocaleDateString('pt-BR', options);
}

// Função para formato com hora
export function formatDateWithTime(inputDateString) {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Date(inputDateString).toLocaleDateString('pt-BR', options);
}
