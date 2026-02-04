import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import "./App.css";

import ScrollToTop from "./pages/ScrollTop";
import SearchPage from "./pages/search";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/about";
import ContactUs from "./pages/contact";
import Register from "./pages/register";
import Signin from "./pages/login";
import HowItWorks from "./pages/work";
import VehicleFinder from "./pages/finder";
import AllVehicles from "./pages/Allvehicles";
import UsedVehicles from "./pages/Usedvehicles";
import SearchByMake from "./pages/make";
import SalesList from "./pages/saleslist";
import SavedSearches from "./pages/saved";
import VehicleAlerts from "./pages/alerts";
import TodaysAuctions from "./pages/today";
import AudiPricelist from "./pages/audi";
import AudiStandardLine from "./pages/Satndardline";
import GetRoadPrice from "./pages/roadprice";
import OnRoadPrice from "./pages/OnRoadPriceCalculator";
import ImportCarForm from "./pages/import";
import AuctionsCalendar from "./pages/calendar";
import JoinAuctions from "./pages/join";
import PriceCalculator from "./pages/calculator";
import CertifiedCarsPage from "./pages/certified";
import BuyYourVehicle from "./pages/buy";
import SellInAuction from "./pages/sell";
import SupportCenter from "./pages/center";
import VehicleDelivery from "./pages/delivery";
import ChaudhryNews from "./pages/news";
import SalvageVehicles from "./pages/Salvagevehicles";
import UsedCars from "./pages/details";
import AddVehicles from "./pages/add-vehicles";
import MyBids from "./pages/my-bids";
import MakeBidding from "./pages/make-bidding";
import LotsWon from "./pages/lots-won";
import LotsLost from "./pages/lots-lost";
import PaymentMethod from "./pages/payment";
import SoldVehicles from "./pages/soldVehicles";
// Admin pages
import AdminLogin from "./admin/pages/admin-login";
import AdminLayout from "./admin/components/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./admin/pages/admin-dashboard";
import AddAdminVehicle from "./admin/pages/admin-vehicles";
import AdminBidHistory from "./admin/pages/admin-bidhistory";
import AdminClosedAuctions from "./admin/pages/admin-closedauctions";
import ManageUsers from "./admin/pages/admin-manageusers";
import UserProvider from "./context/UserProvider";
import VehicleProvider from "./context/VehicleProvider";
import AddVehiclePrices from "./admin/pages/AddVehiclePrices";
import AddVehicleSpects from "./admin/pages/AddVehicleSpects";
import VehicleDetailsViewer from "./admin/pages/VehicleDetailsViewer";
import LiveAuctions from "./admin/pages/LiveAuctions";
import AuctionsProvider from "./context/AuctionsProvider";
import UpcomingAuctions from "./admin/pages/UpcomingAuctions";
import SellerVehiclePrices from "./components/SellerVehiclePrices";
import SellerVehicleDetails from "./components/SellerVehicleDetails";
import SellerLiveAuctions from "./components/SellerLiveAuctions";
import SellerLayout from "./components/SellerLayout";
import SellerVehicleSpects from "./components/SellerVehicleSpects";
import SellerProtectedRoute from "./SellerProtectedRoute";
import CustomerList from "./admin/pages/CustomerList";
import FilterPriceCars from "./pages/FilterPriceCars";
import WheelBidzAlert from "./pages/alert";
import { useDispatch, useSelector } from "react-redux";
import { BrandList } from "./admin/pages/BrandList";
import { Customerbid } from "./admin/pages/Customerbid";
import { SellerIntro } from "./pages/SellerIntro";
import { SellerDashboard } from "./admin/pages/SellerDashboard";
import RegistrationWithEmail from "./components/RegistrationWithEmail";
import ValidationEmail from "./pages/ValidationEmail";
import { ModelList } from "./pages/ModelList";
import { SeriesList } from "./components/SeriesList";
import { BecomePartner } from "./pages/BecomePartner";
import { Suggestion } from "./pages/Suggestion";
import { SuggestionList } from "./admin/pages/SuggestionList";
import { ContactList } from "./admin/pages/ContactList";
import { BecomePartnerList } from "./admin/pages/BecomePartnerList";
import { CitiesList } from "./pages/CitiesList";
import { VehicleApproval } from "./admin/pages/VehicleApproval";
import { addMake, addModel } from "./components/Redux/SelectorCarSlice";
import { WishList } from "./pages/WishList";
import { SubcribeUserList } from "./admin/pages/SubcribeUserList";
import { AwaitingApproval } from "./admin/pages/AwaitingApprovel";
import { AccountSetting } from "./admin/pages/AccountSetting";
import { AuctionEvent } from "./admin/pages/AuctionEvent";
import VehicleInspection from "./pages/VehicleInspection";
import AdminInspection from "./pages/AdminInspection";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import ViewInspectionVehicle from "./pages/ViewInspectionVehicle";
import { Configuration } from "./pages/Configuration";
import { AdminAccount } from "./pages/AdminAccount";
import { CustomerProtectedRoute } from "./CustomerProtectedRoute";
import { PastVehicle } from "./admin/pages/PastVehicle";
import { SetEventAuction } from "./admin/pages/SetEventAuction";
import { AssignEvent } from "./admin/pages/AssignEvent";
import { UnsoldVehicles } from "./admin/pages/UnsoldVehicles";
import { IncrementConfig } from "./admin/pages/IncrementConfig";
import { AddPayment } from "./admin/pages/Addpayment";
import Sellers from "./admin/pages/Sellers";
import { CommissionList } from "./admin/pages/CommissionList";
import { BuyVehicles } from "./pages/BuyVehicles";

function Layout() {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.auth);

  console.log("location =>", location.pathname);

  const { make, model } = useSelector((state) => state?.carSelector);

  const dispatch = useDispatch();

  const role = currentUser?.role;

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isSellerRoute = location.pathname.startsWith("/seller/dashboard");
  const isAdminLogin = location.pathname === "/admin-login";
  const liveAuction = location.pathname === "/seller/live-auctions";
  const vehicleList = location.pathname === "/seller/addVehicle";
  const unsoldVehicle = location.pathname === "/seller/unsold";
  const upcomingAuction = location.pathname === "/seller/upcoming-auctions";
  const sellerInspection = location.pathname === "/seller/inspection";
  const soldVehicle = location.pathname === "/seller/pastvehicle";
  const bidHistory = location.pathname === "/seller/my-bids";

  const hideNavbarFooter =
    isAdminRoute ||
    isAdminLogin ||
    isSellerRoute ||
    liveAuction ||
    upcomingAuction ||
    vehicleList ||
    unsoldVehicle ||
    soldVehicle ||
    sellerInspection ||
    bidHistory;

  if (
    location.pathname === "/" ||
    location.pathname === "/about" ||
    location.pathname === "/saleslist" ||
    location.pathname === "/certified" ||
    location.pathname === "/today" ||
    location.pathname === "/calendar" ||
    location.pathname === "/join" ||
    location.pathname === "/partner" ||
    location.pathname === "/suggestion" ||
    location.pathname === "/contact"
  ) {
    dispatch(addMake(""));
    dispatch(addModel(""));
  }

  return (
    <>
      {!hideNavbarFooter && location.pathname === "/"}
      <ScrollToTop />

      {!hideNavbarFooter &&
        (location.pathname === "/" ||
          (role !== "admin" && role !== "seller")) && <Navbar />}
      <Routes>
        {/* Main Routes */}
        <Route element={<CustomerProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/alert" element={<VehicleAlerts />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/soldVehicles" element={<SoldVehicles />} />

          <Route path="/about" element={<About />} />

          <Route path="/customerstats" element={<CustomerDashboard />} />

          <Route path="/contact" element={<ContactUs />} />

          <Route path="/partner" element={<BecomePartner />} />

          <Route path="/suggestion" element={<Suggestion />} />

          <Route path="/wishlist" element={<WishList />} />

          <Route path="/register" element={<Register />} />

          <Route path="/validation" element={<ValidationEmail />} />

          <Route path="/registerwitemail" element={<RegistrationWithEmail />} />

          <Route path="/login" element={<Signin />} />

          <Route path="/work" element={<HowItWorks />} />

          <Route path="/finder" element={<VehicleFinder />} />

          <Route path="/Allvehicles" element={<AllVehicles />} />

          <Route path="/Usedvehicles" element={<UsedVehicles />} />

          <Route path="/make" element={<SearchByMake />} />

          <Route path="/sellerIntro" element={<SellerIntro />} />

          <Route path="/saleslist" element={<SalesList />} />

          <Route path="/saved" element={<SavedSearches />} />

          <Route path="/alerts" element={<VehicleAlerts />} />

          <Route path="/today" element={<TodaysAuctions />} />

          <Route path="/carPrice/:carType" element={<AudiPricelist />} />

          <Route path="/standardline/:id" element={<AudiStandardLine />} />

          <Route path="/detailbid/:id" element={<Customerbid />} />

          <Route path="/roadprice" element={<GetRoadPrice />} />

          <Route
            path="/OnRoadPriceCalculator/:city"
            element={<OnRoadPrice />}
          />

          <Route path="/import" element={<ImportCarForm />} />

          <Route path="/calendar" element={<AuctionsCalendar />} />

          <Route path="/join" element={<JoinAuctions />} />

          <Route path="/buyvehicles" element={<BuyVehicles />} />

          <Route path="/calculator" element={<PriceCalculator />} />

          <Route path="/certified" element={<CertifiedCarsPage />} />

          <Route path="/buy" element={<BuyYourVehicle />} />

          <Route path="/sell" element={<SellInAuction />} />

          <Route path="/center" element={<SupportCenter />} />

          <Route path="/accountsetting" element={<AccountSetting />} />

          <Route path="/delivery" element={<VehicleDelivery />} />
          <Route path="/news" element={<ChaudhryNews />} />

          <Route path="/details/:type" element={<UsedCars />} />

          <Route
            path="/filterprice/:name/:value"
            element={<FilterPriceCars />}
          />

          <Route path="/Salvagevehicles" element={<SalvageVehicles />} />
          <Route path="/add-vehicles" element={<AddVehicles />} />

          <Route path="/my-bids" element={<MyBids />} />
          <Route path="/make-bidding" element={<MakeBidding />} />
          <Route path="/lots-won" element={<LotsWon />} />
          <Route path="/lots-lost" element={<LotsLost />} />
          <Route path="/payment" element={<PaymentMethod />} />
        </Route>
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />

          <Route path="vehicles" element={<AddAdminVehicle />} />

          <Route path="eventauction" element={<SetEventAuction />} />

          <Route path="/admin/addbrand" element={<BrandList />} />

          <Route path="/admin/addmodel" element={<ModelList />} />

          <Route path="/admin/addseries" element={<SeriesList />} />

          <Route path="/admin/approval" element={<VehicleApproval />} />

          {/** 

          <Route path="/admin/awaiting" element={<AwaitingApproval />} />

          */}

          <Route path="/admin/city" element={<CitiesList />} />

          <Route path="/admin/accountsetting" element={<AccountSetting />} />

          <Route path="/admin/pastvehicle" element={<PastVehicle />} />

          <Route path="/admin/addpayment" element={<AddPayment />} />

          <Route path="/admin/configuration" element={<Configuration />} />

          <Route path="/admin/increment" element={<IncrementConfig />} />

          <Route path="/admin/account" element={<AdminAccount />} />

          <Route path="/admin/auctionevent" element={<AuctionEvent />} />

          <Route path="/admin/assignevent" element={<AssignEvent />} />

          <Route path="/admin/uploaddocs" element={<AdminInspection />} />

          <Route path="/admin/inspection" element={<ViewInspectionVehicle />} />

          <Route path="/admin/suggestionlist" element={<SuggestionList />} />

          <Route path="/admin/contactlist" element={<ContactList />} />

          <Route path="/admin/commissionlist" element={<CommissionList />} />

          <Route
            path="/admin/becomepartnerlist"
            element={<BecomePartnerList />}
          />

          <Route path="vehicle-prices" element={<AddVehiclePrices />} />

          <Route path="vehicle-spects" element={<AddVehicleSpects />} />

          <Route path="vehicle-details" element={<VehicleDetailsViewer />} />

          <Route path="live-auctions" element={<LiveAuctions />} />

          <Route path="/admin/unsold" element={<UnsoldVehicles />} />

          <Route path="upcoming-auctions" element={<UpcomingAuctions />} />

          <Route path="bid-history" element={<AdminBidHistory />} />

          <Route path="manage-users" element={<ManageUsers />} />

          <Route path="/admin/seller" element={<Sellers />} />

          <Route path="/admin/customerlist" element={<CustomerList />} />

          <Route path="/admin/subcribeuser" element={<SubcribeUserList />} />
        </Route>

        <Route
          path="/seller"
          element={
            <SellerProtectedRoute>
              <SellerLayout />
            </SellerProtectedRoute>
          }
        >
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/addVehicle" element={<AddVehicles />} />{" "}
          {/* /seller */}
          <Route path="add-vehicles" element={<AddVehicles />} />{" "}
          {/* /seller/add-vehicles */}
          <Route path="vehicle-prices" element={<SellerVehiclePrices />} />
          <Route path="vehicle-spects" element={<SellerVehicleSpects />} />
          <Route path="vehicle-details" element={<SellerVehicleDetails />} />
          <Route path="/seller/inspection" element={<VehicleInspection />} />
          {/* Auctions */}
          <Route
            path="/seller/live-auctions"
            element={<SellerLiveAuctions />}
          />
          <Route
            path="/seller/upcoming-auctions"
            element={<UpcomingAuctions />}
          />
          <Route path="/seller/unsold" element={<UnsoldVehicles />} />
          <Route path="/seller/pastvehicle" element={<PastVehicle />} />
          <Route path="/seller/accountsetting" element={<AccountSetting />} />
          {/* Bids */}
          <Route path="my-bids" element={<MyBids />} />
          <Route path="lots-lost" element={<LotsLost />} />
          <Route path="lots-won" element={<LotsWon />} />
        </Route>
      </Routes>

      {!hideNavbarFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <VehicleProvider>
          <AuctionsProvider>
            <Router>
              <Layout />
            </Router>
          </AuctionsProvider>
        </VehicleProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
