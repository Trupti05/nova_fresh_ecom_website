import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import React from 'react';
import Applayout from './layout/Applayout';
import Homepage from './pages/Homepage';
import Detail from './pages/Detail';
import Category from './pages/Category';
import Wishlist from './component/Profile/Whishlist';
import Profilelayout from './layout/Profilelayout';
import Youraccount from './component/Profile/Youraccount';
import YourOrder from './component/Profile/YourOrder';
import Recommendation from './component/Profile/Recommendation';
import { WishlistProvider } from './component/Home/WishlistContext';
import { ProductProvider } from './context/ProductContext';
import CheckOutPage from './pages/CheckOutPage';
import { ToastContainer } from "react-toastify";
import Toast from './component/Home/Toast';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Applayout />,
      children: [
        { path: "/", element: <Homepage /> },
        { path: "/:category", element: <Category /> },
        { path: "/detail", element: <Detail /> },
        { path: "/checkout", element: <CheckOutPage /> }
      ]
    },
    {
      path: "/profile",
      element: <Profilelayout />,
      children: [
        { path: "/profile", element: <Youraccount /> },
        { path: "/profile/order", element: <YourOrder /> },
        { path: "/profile/whishlist", element: <Wishlist /> },
        { path: "/profile/recommendation", element: <Recommendation /> }
      ]
    }
  ]);

  return (
    <ProductProvider>
      <WishlistProvider>
        <ToastContainer />
        <Toast />
        <RouterProvider router={router} />
      </WishlistProvider>
    </ProductProvider>
  );
}

export default App;
