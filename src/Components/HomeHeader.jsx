import React, { useState,useEffect } from "react";
import logo from "../Components/Photos/download.png";
import searchLogo from "../Components/Photos/searchLogo.png";
import CartImage from "../Components/Photos/newCart.png";
import BlinkItLogo from "./Photos/app_logo.jpg"

import {
  CustomHeader,
  LoginLogo,LoginLastp,
  LogoDivImg,SavedAddress,SignUpP,
  LocationDrop,PhoneNUmberp,SignUp,
  CartDiv,
  CartImg,FirstContainer,
  DeliveryTime,ProfileElementDiv,SmallAddressDiv,
  SearchBarDemo,BackButton,SellerInLogin,
  SearchBarDemoAround,
  SearchImg,ContinueButton,HeaderAddress,SignUpDiv,
  AccountDropDown,MyAccount,QrCodeDiv,
  Cart,CountryCodep,ProfileElement,QrCode,ScanText,LocationImg,AddressItem,AnimatedPlaceholder,
  LoginButton,IndiaLastMinh2,LoginOrSignUph3,BlueText,LastText,DialogBox2,BlurredBackground,Dialog,AllSavedAddress,
  LoginDialogDiv,LoginDialogOverlay,InputContainer,InputField,AccountButton,BlurBackground,DialogButton,DialogBox
} from "./StyledComponents/HeaderStyledComponents";
import { Link } from "react-router-dom";
import { CartSideBar } from "./Cart";
import styled from "styled-components";
import qrcode from "./Photos/qrcode.png"
import location from "./ProfilePics/location.jpg"
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

function SignUpCall({type, id, password}){
  const body = {
    "mobileNumber" : id,
    "password" : password
  }
  const url = "http://localhost:5227/api/UserAuth/signup?type=" + type;
  return axios.post(url,body)
}

function UserLoginCall({mobileNumber, password}){
  const body = {
    "mobileNumber" : mobileNumber,
    "password" : password
  }
  return axios.post("http://localhost:5227/api/UserAuth/login", body)
}

function SellerLoginCall({mobileNumber, password}){
  const body = {
    mobileNumber : mobileNumber,
    password : password
  }
  return axios.post("http://localhost:5227/api/UserAuth/seller/login", body)
}

function HomeHeader({isLoggedIn,setShowLoginDialog,setIsLoggedIn,showLoginDialog}) {
  const placeholders = [
    "Search 'Apple'",
    "Search 'Milk'",
    "Search 'Bread'",
    "Search 'Chocolate'",
    "Search 'Butter'"
  ];
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholders[0]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem('phoneNumber') || ''); // Retrieve phoneNumber from localStorage
  const [sellerId, setSellerId] = useState();
  const [sellerPw, setSellerPw] = useState();
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1); 
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const [showDialog, setShowDialog] = useState(false); 
  const [addresses, setAddresses] = useState([]); 
  const [currentAddress, setCurrentAddress] = useState("Select Delivery Address");



  const { mutate: doSignUp} = useMutation({mutationFn : SignUpCall});
  const {mutate : doUserLogin} = useMutation({mutationFn : UserLoginCall});
  const {mutate : doSellerLogin} = useMutation({mutationFn : SellerLoginCall})



  useEffect(() => {
    const token = localStorage.getItem("jwtToken")
    if (token != null){
      setIsLoggedIn(true)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(() => {
        setCurrentPlaceholder((prev) => {
          const currentIndex = placeholders.indexOf(prev);
          return placeholders[(currentIndex + 1) % placeholders.length];
        });
      }, 500); 
    }, 2000);
    return () => clearInterval(interval);
  }, []);


  const handleSellerId = (e) =>{
    const newSellerId = e.target.value;
    setSellerId(newSellerId)
    localStorage.setItem("sellerId", newSellerId)
  }


  const handlePhoneChange = (e) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    localStorage.setItem('phoneNumber', newPhoneNumber); // Store phoneNumber in localStorage
  };



  const handleLoginClick = async () => {
    doUserLogin({mobileNumber : phoneNumber, password},
      {
        onSuccess: (response) => {
          const data = response.data;
          const jwtToken = data.token;
       
          localStorage.setItem('jwtToken', jwtToken);
        
          setStep(1); 
          setPassword(''); 
          setShowLoginDialog(false); // Close the login dialog
          setIsLoggedIn(true); 
        },
        onError : (err) => {
          const data = err.response; 
        
          if (data.status === 401 && data.data === 'inValid Mobile Number!') {
            setError(true);
            setErrorMessage("Its your First Time! Please Signup")
            setTimeout(() => {
              setError(false);
              setStep(3);
            }, 2000);
            setStep(3); 
          } else {
            setError(true);
            setErrorMessage('inValid Password!')
            setTimeout(() => {
              setError(false);
              setStep(2); // Keep the user on the step to retry login
            }, 2000);
          }
        }
      }
    )
  };


  const handleSignUp = async () => {
      doSignUp({type: "buyer", id : phoneNumber,password: password},
        {
          onSuccess : (response) => {
            const data = response.data;
            const jwtToken = data.token;

            localStorage.setItem('jwtToken', jwtToken);
          
            setStep(1); 
            setPassword('');
            setShowLoginDialog(false); 
            setIsLoggedIn(true); 
          },
          onError : (err) => {
            if (err.response?.status === 400 && err.response?.data === 'Mobile number already exists. Cannot create new User.') {
              setError(true);
              setErrorMessage("Mobile number already exists. Cannot create new User.")
              setStep(3);
              setTimeout(() => {
                setError(false);
                setStep(3);
              }, 2000);
              
              }
          }
        }
      );
  };



  const handleSellerLogin = async () => {
    doSellerLogin({mobileNumber : sellerId, password : sellerPw}, {
      onSuccess : (response) => {
        const data = response.data;
        const jwtToken = data.token; 

        localStorage.setItem('jwtTokenSeller', jwtToken);

        setStep(1); 
        setSellerPw(''); 
        setShowLoginDialog(false); 
        
        window.location.replace("/seller");

      },
      onError : (err) => {
        const data = err.response; 
        console.log(data)
        if (data.status === 404 && data.data === 'Please signup before login!') {
          console.log(2)
          setError(true);
          setErrorMessage("Its your First Time! Please Signup")
          setStep(5); 
        } else {
          setError(true);
          setErrorMessage("invalid Password")
          setTimeout(() => {
            setError(false);
            setStep(4);
          }, 2000);
        }
      }
    })
  };



  const handleSellerSignUp = async () => {
    doSignUp({type: "seller", id : sellerId, password : sellerPw}, {
      onSuccess : (response) => {
        const data = response.data;
        const jwtToken = data.token;
        
        localStorage.setItem('jwtToken', jwtToken);
      
        setStep(1); 
        setSellerPw(''); 
        setShowLoginDialog(false); 
        setIsLoggedIn(false); 
        window.location.replace("/seller");
      }, 
      onError : (err) => {
        const data = err.response.data; 
        if (response.status === 400 && data === 'Mobile number already exists. Cannot create new seller.') {
          setError(true);
          setErrorMessage("Mobile number already exists. Cannot create new Seller.")
          setStep(4);
          setTimeout(() => {
            setError(false);
            setStep(4); 
          }, 2000);
        }
      }
    })
  };

  const isPhoneNumberValid = phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);
  
  const handleContinueClick = () => {
    if (isPhoneNumberValid) {
      setStep(2); 
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('phoneNumber');
    setIsAccountDialogOpen(false);
    window.location.href = '/';  
  };

  const handleProfile = () => {
    setIsAccountDialogOpen(false);
    window.location.href = '/profile';  
  };
  return (
    <CustomHeader>
      <Link to="/">
        <div>
          <LogoDivImg src={logo} alt="Logo" />
        </div>
      </Link>


      <div>
        <DeliveryTime>Delivery in 10 minutes</DeliveryTime>
        <HeaderAddress onClick={() => setShowDialog(!showDialog)}>{currentAddress}</HeaderAddress>
      </div>


      {showDialog && <BlurredBackground onClick={() => setShowDialog(false)} isVisible={showDialog} />}
      
      <Dialog isVisible={showDialog}>
        <SavedAddress>Saved Address: </SavedAddress>
      <AllSavedAddress>
              {addresses.map((address, index) => (
                <SmallAddressDiv>
                <LocationImg src={location} alt="Location" />
                <AddressItem key={index} onClick={() => (undefined)}>
                  {address}
                </AddressItem></SmallAddressDiv>
                
              ))}
            </AllSavedAddress>
      </Dialog>

      <Link to="/search" style={{ textDecoration: 'none' }}>
      <SearchBarDemoAround>
        <SearchImg src={searchLogo} alt="lens" />

        <SearchBarDemo type="text" placeholder={currentPlaceholder}/>
      </SearchBarDemoAround>
    </Link>

  
        <div>
          {isLoggedIn ? (
             <>
             {/* Account button */}
             <AccountButton onClick={() => setIsAccountDialogOpen(!isAccountDialogOpen)}>
               Account 
             </AccountButton>
       
             {/* Background blur and dialog box */}
             {isAccountDialogOpen && (
               <>
                 {/* Blurred background */}
                 <BlurBackground onClick={() => setIsAccountDialogOpen(!isAccountDialogOpen)} />
       
                 {/* Dialog box */}
                 <DialogBox>
                  <div>
                  <MyAccount>My Account</MyAccount>
                  <PhoneNUmberp>{phoneNumber}</PhoneNUmberp>
                  </div>
                  <ProfileElementDiv>
                  <ProfileElement onClick={handleProfile}>My Orders</ProfileElement>
                  </ProfileElementDiv>
                   <ProfileElementDiv>
                   <ProfileElement onClick={handleProfile}>Saved Address</ProfileElement>
                   </ProfileElementDiv>
                   <ProfileElementDiv>
                   <ProfileElement>FAQ's</ProfileElement>
                   </ProfileElementDiv>
                   <ProfileElementDiv>
                   <ProfileElement onClick={handleProfile}>Account Privacy</ProfileElement>
                   </ProfileElementDiv>
                   <ProfileElementDiv>
                   <ProfileElement onClick={handleLogout}>Log Out</ProfileElement>
                   </ProfileElementDiv>
                   
                   <QrCodeDiv>
                    <QrCode src={qrcode} alt = "qrcode" />
                    <div>
                    <ScanText>Simple way to
                    get groceries</ScanText>
                    <BlueText>in minutes</BlueText>
                    <LastText>Scan the QR code and download blinkit app</LastText>
                    </div>
                    

                   </QrCodeDiv>
                 </DialogBox>
               </>
             )}
           </>
          ) : (
            <LoginButton onClick={() => setShowLoginDialog(true)}>LOGIN</LoginButton>
          )}
        </div>
     

    
      {showLoginDialog && (
       <LoginDialogOverlay>
       <LoginDialogDiv>
         {step === 1 && (
           <>
             <FirstContainer>
               <BackButton onClick={() => setShowLoginDialog(false)}>←</BackButton>
               <LoginLogo src={BlinkItLogo} alt="Logo" />
               <SellerInLogin onClick={() => setStep(4)}>Seller</SellerInLogin>
             </FirstContainer>
 
             <IndiaLastMinh2>India's last minute app</IndiaLastMinh2>
             <LoginOrSignUph3>Log in or Sign up</LoginOrSignUph3>
             
               <SignUpDiv>
               <InputContainer>
               <CountryCodep>+91</CountryCodep>
               <InputField
                 type="text"
                 value={phoneNumber}
                 onChange={handlePhoneChange}
                 placeholder="Enter your phone number"
               />
               </InputContainer>
               <SignUp onClick={() => setStep(3)} >Sign Up</SignUp>
               </SignUpDiv>
               
             
             
             <ContinueButton disabled={!isPhoneNumberValid} onClick={handleContinueClick}>
               Continue
             </ContinueButton>
             <LoginLastp>
               By continuing, you agree to our Terms of service & Privacy policy
             </LoginLastp>
           </>
         )}

         {step === 2 && (
           <>
             <FirstContainer>
               <BackButton onClick={() => setStep(1)}>←</BackButton> {/* Back to Step 1 */}
               <LoginLogo src={BlinkItLogo} alt="Logo" />
             </FirstContainer>
 
             <h3>Enter your password</h3>
             <InputField
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Enter your password"
             />
             <ContinueButton onClick={handleLoginClick}>Log In</ContinueButton>
             {error && (
              <p style={{ color: 'red' }}>{errorMessage}</p>
             )
             }
             
           </>
         )}

      {step === 3 && (
           <>
             <FirstContainer>
               <BackButton onClick={() => setStep(1)}>←</BackButton> {/* Back to Step 1 */}
               <LoginLogo src={BlinkItLogo} alt="Logo" />
             </FirstContainer>
             <SignUpP>Sign Up</SignUpP>
             <InputField
               type="number"
               value={phoneNumber}
               onChange={handlePhoneChange}
               placeholder="Enter your Mobile Number"
             />
             <InputField
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Enter your password"
             />
             <ContinueButton onClick={handleSignUp}>SignUp</ContinueButton>
             {error && <p style={{ color: 'red' }}>{errorMessage}</p>}
           </>
         )}
 
        {step === 4 && (
           <>
             <FirstContainer>
               <BackButton onClick={() => setStep(1)}>←</BackButton> 
               <LoginLogo src={BlinkItLogo} alt="Logo" />
             </FirstContainer>
             
 
             <h3>Login</h3>
             <InputField
               type="text"
               value={sellerId}
               onChange={handleSellerId}
               placeholder="Enter your seller user name"
             />
             <InputField
               type="password"
               value={sellerPw}
               onChange={(e) => setSellerPw(e.target.value)}
               placeholder="Enter your password"
             />
             <ContinueButton onClick={handleSellerLogin}>LogIn</ContinueButton>
             {error && <p style={{ color: 'red' }}>{errorMessage}</p>}
           </>
         )}
       

      {step === 5 && (
        <>
           <FirstContainer>
               <BackButton onClick={() => setStep(1)}>←</BackButton> 
               <LoginLogo src={BlinkItLogo} alt="Logo" />
             </FirstContainer>
             <SignUpP>Sign Up</SignUpP>
             
             <InputField
               type="text"
               value={sellerId}
               onChange={handleSellerId}
               placeholder="Enter your UserName"
             />
             <InputField
               type="password"
               value={sellerPw}
               onChange={(e) => setSellerPw(e.target.value)}
               placeholder="Enter your password"
             />
             <ContinueButton onClick={handleSellerSignUp}>SignUp</ContinueButton>
             {error && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </>
      )
      }
      </LoginDialogDiv>
     </LoginDialogOverlay>
      )}

      

      <CartDiv onClick={() => setIsCartOpen(!isCartOpen)}>
        <CartImg src={CartImage} alt="CartImage" />
        <Cart>My Cart</Cart>
      </CartDiv>

      <CartSideBar isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} isLoggedIn={isLoggedIn} setShowLoginDialog={setShowLoginDialog} setIsLoggedIn={setIsLoggedIn}/>
    </CustomHeader>
  );
}

export default HomeHeader;
