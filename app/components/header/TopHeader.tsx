export default function TopHeader() {
  return (
    <div className="bg-scroll text-red relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-8 py-4 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/2/2e/Torino_FC_Logo.svg"
            alt="Torino Logo"
            className="w-14 h-14 sm:w-16 sm:h-16"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Jan Radoch</h1>
            <div className="flex flex-wrap gap-3 text-sm mt-2">
              <a href="#" className="underline">
                Website
              </a>
              <a href="#" className="underline">
                Ticket
              </a>
              <a href="#" className="underline">
                Shop
              </a>
            </div>
          </div>
        </div>
        <div className="flex justify-center sm:justify-end space-x-4 text-lg">
          <i className="fab fa-facebook">aaaa</i>
          <i className="fab fa-instagram">bbbb</i>
          <i className="fab fa-x-twitter">cccc</i>
          <i className="fab fa-youtube"></i>
        </div>
      </div>
    </div>
  );
}
