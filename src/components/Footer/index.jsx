export default function Footer() {
  return (
    <footer className="w-full bg-[#6a307d] py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
        <p className="text-white font-['Poppins'] text-sm text-center">
          Desenvolvido por DevClub - {new Date().getFullYear()} - Todos os direitos reservados
        </p>
      </div>
    </footer>
  )
}
