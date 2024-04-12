const dataFormater = new Intl.DateTimeFormat("pt-BR", {
  day: 'numeric',
  month: "long",
  year: "numeric"
})

export default dataFormater