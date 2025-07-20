// import AppContent from "./components/AppContent";
import AppHeader from "./components/AppHeader";
import AppSidebar from "./components/AppSidebar";
import CreateInvoicePage from "./pages/CreateInvoicePage";
// import InvoicePage from "./pages/InvoicePage";

function App() {
  return (
    <div className="main-container flex font-inter">
      <div className="flex sidebar-container bg-white border-r border-gray-200 h-screen">
        <AppSidebar />
      </div>
      <div className="main-area-container flex-1 flex flex-col">
        <div className="header-container border-b border-gray-200">
          <AppHeader />
        </div>
        <div className="content-container flex-1 p-4">
          {/* <InvoicePage /> */}
          <CreateInvoicePage />
        </div>
      </div>
    </div>
  );
}

export default App;
