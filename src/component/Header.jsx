import React, { useState } from "react";
import logo from "../component/images/logo.png";
import {
  Search,
  ChevronDown,
  ShoppingCart,
  LogIn,
  MapPin,
  LocateFixed,
} from "lucide-react";
import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import Signup from "../Pages/Signup";
import Login from "../Pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../slices/authSlice";
import { useProduct } from "../context/ProductContext";
import Cart from "../pages/Cart";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Header() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  // console.log("Printing token in header", token);

  const [isOpen, setIsOpen] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);
  const [logInModal, setLogInModal] = useState(false);
  const [locationPopup, setLocationPopup] = useState(false);
  const { addToCart } = useProduct();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [city, setCity] = useState("Select your location");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPopup, setSearchPopup] = useState(false);

  const handleClickOutside = (event) => {
    if (event.target.classList.contains("popup-overlay")) {
      setLocationPopup(false);
    }
  };

  // Handle input change and fetch suggestions for location
  const handleInputChange = (e) => {
    setLocation(e.target.value);
    fetchSuggestions(e.target.value);
  };

  // Handle selecting a suggestion for location
  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion.display_name);
    setSuggestions([]);
    setCity(suggestion.display_name);
    setLocationPopup(false); // Clear suggestions after selection
  };

  // Fetch location suggestions dynamically from OpenStreetMap API
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=IN`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Detect user's location using Geolocation API
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            if (data && data.address) {
              const detectedCity =
                data.address.city ||
                data.address.state_district ||
                data.address.state ||
                data.address.town ||
                data.address.village ||
                data.address.county ||
                "Unknown Location";
              setCity(detectedCity);
              toast.success(`Location detected: ${detectedCity}`, {
                position: "top-right",
              });
              setLocationPopup(false);
            }
          } catch (error) {
            toast.error("Failed to fetch location. Try again!", {
              position: "top-right",
            });
          }
        },
        () => {
          toast.error("Location access denied!", { position: "top-right" });
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.", {
        position: "top-right",
      });
    }
  };

  //Search location including suggestions
  const searchLocation = async (query) => {
    if (!query) {
      toast.error("Please enter a location to search!");
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=IN`
      );
      const data = await response.json();

      console.log("Search Results:", data); // Debugging

      if (data.length > 0) {
        const foundCity = data[0].display_name;
        toast.success(`Location found: ${foundCity}`);
        setCity(foundCity);
        setLocationPopup(false);
      } else {
        toast.error("No results found for the given location!");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search location. Try again!");
    }
  };

  //search product
  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Product name is required");
      return;
    }
    console.log("Searching for:", query);
    try {
      const { data } = await axios.get(
        `http://localhost:8000/product/search?q=${query}`
      );
      setSearchResults(data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error("Error fetching search results. Try again!");
      }
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <>
      <div className="fixed z-50 bg-white flex w-full py-8 px-12">
        {/* Logo */}
        <div className="w-2/12">
          <Link to="/">
            <img
              src={logo}
              className="w-[70%] flex item-center my-1 "
              alt="Logo"
            />
          </Link>
        </div>

        {/* Search Section */}
        <div className="w-7/12 ">
          <div className="flex w-8/12 border border-black rounded-lg m-auto">
            <div className="pl-4 py-2">
              <Search />
            </div>
            <input
              type="text"
              placeholder="Search your item"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="border-none outline-none px-2 py-2"
              onFocus={() => setSearchPopup(true)}
              onBlur={() => setTimeout(() => setSearchPopup(false), 200)}
            />
          </div>
        </div>

        {/* Location, Cart & Profile Icon */}
        <div className="flex item-center justify-between my-auto w-3/12">
          <div className="flex md:gap-3 lg:gap-4 justify-between items-center gap-5">
            <button onClick={() => setLocationPopup(true)}>
              <div className="flex cursor-pointer">
                <div className="flex">
                  <p className="text-sm lg:text-base">{city}</p>
                  <ChevronDown />
                </div>
              </div>
            </button>

            <div>
              <button onClick={() => setIsCartOpen(!isOpen)}>
                <div className="flex cursor-pointer">
                  <ShoppingCart />
                  <span className="text-[10px] bg-red-800 text-white rounded-full w-4 h-4">
                    {addToCart.length}
                  </span>
                </div>
              </button>
              {isCartOpen && (
                <Cart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
              )}
            </div>

            <div className="cursor-pointer">
              <CgProfile
                className="text-[20px]"
                onClick={() => setIsOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* Profile Popup Modal */}
        {isOpen && (
          <div
            className="absolute z-20 right-5 mt-16 bg-white rounded-lg w-52 shadow-xl p-3"
            onClick={() => setIsOpen(false)}
          >
            <div className="bg-white rounded-lg w-full">
              {/* Modal Links */}
              <div className="flex justify-between shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
                <p className="flex flex-col gap-y-1">
                  <Link className="">Your Account</Link>
                  <Link to="/profile/order">Your Orders</Link>
                  <Link to="/profile/whishlist" className="">
                    Your Wish List
                  </Link>
                  <Link to="/profile/recommendation">Your Recommendation</Link>
                  <Link to="/profile" className="">
                    Profile
                  </Link>
                  <Link className="" onClick={() => setSignUpModal(true)}>
                    Signin
                  </Link>
                  {token ? (
                    <Link
                      className=""
                      onClick={() => {
                        dispatch(setToken(null));
                        localStorage.removeItem("token");
                        // setLogInModal(true)
                      }}
                    >
                      Logout
                    </Link>
                  ) : (
                    <Link className="" onClick={() => setLogInModal(true)}>
                      Login
                    </Link>
                  )}
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-5 h-5 flex items-center justify-center"
                >
                  <RxCross2 className="cursor-pointer text-[18px] text-gray-600 hover:text-black" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Signup Popup Modal */}
        {signUpModal && (
          <Signup
            setSignUpModal={setSignUpModal}
            setLogInModal={setLogInModal}
          />
        )}

        {/* Signup Popup Modal */}
        {logInModal && (
          <Login
            setSignUpModal={setSignUpModal}
            setLogInModal={setLogInModal}
          />
        )}
      </div>
      <div>
        {locationPopup && (
          <div
            className="fixed z-20 top-auto left-auto w-full h-full flex items-center justify-center rounded-2xl popup-overlay"
            onClick={handleClickOutside}
          >
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-168 h-66 overflow-y-auto scrollbar-none">
              <div className="flex border border-gray-300 rounded-lg bg-white mb-6">
                <div className="pl-4 py-2">
                  <Search className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") searchLocation(location);
                  }}
                  placeholder="Search delivery location"
                  className="border-none outline-none px-2 py-2"
                />
              </div>

              <div className="flex justify-end gap-3">
                <p className="mt-2 mr-16">
                  Give us your exact location for seamless delivery
                </p>
                <button
                  className="bg-lime-600 text-black px-4 py-2 rounded flex items-center gap-1"
                  onClick={() => {
                    if (!location) {
                      detectLocation();
                    } else {
                      searchLocation(location);
                    }
                  }}
                >
                  <LocateFixed className="w-5 h-5 mt-0.5" /> Detect my Location
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <ul className="mt-4 rounded-lg ">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex items-center p-2 cursor-pointer hover:bg-gray-200 border-b border-gray-300"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <span className="flex-1">{suggestion.display_name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Search Results Dropdown */}
      {searchPopup && searchResults.length > 0 && (
        <div className="absolute w-8/12 bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setQuery(result.pname); 
                setSearchResults([]); 
              }}
            >
              {result.pname}
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default Header;
