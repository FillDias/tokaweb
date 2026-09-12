// Componente de quiz reutilizável — workspace de ensino TOKA
// Uso: bloco .quiz com <input type="radio"> cujo value da opção certa
// bate com o atributo data-certa do .quiz. Ao escolher, mostra feedback.
document.querySelectorAll('.quiz').forEach((quiz) => {
  const certa = quiz.dataset.certa
  const feedbackCerto = quiz.querySelector('.feedback.certo')
  const feedbackErrado = quiz.querySelector('.feedback.errado')

  quiz.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener('change', () => {
      const acertou = input.value === certa
      feedbackCerto?.classList.toggle('mostrar', acertou)
      feedbackErrado?.classList.toggle('mostrar', !acertou)
    })
  })
})
