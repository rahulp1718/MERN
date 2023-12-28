// import { useState } from "react";

// const DropDown = ({
//   handleCountryChange,
//   handleStateChange,
//   handleCityChange,
// }) => {
//   const [country, setCountry] = useState("");
//   const [state, setState] = useState("");
//   const [city, setCity] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//   };

//   const handleCountryChangeLocal = (e) => {
//     setCountry(e.target.value);
//     handleCountryChange(e);
//   };

//   const handleStateChangeLocal = (e) => {
//     setState(e.target.value);
//     handleStateChange(e);
//   };

//   const handleCityChangeLocal = (e) => {
//     setCity(e.target.value);
//     handleCityChange(e);
//   };

//   return (
//     <div className="bg-gray-600 text-3xl h-screen flex flex-col mt-20 ml-10">
//       <div>
//         <form onSubmit={handleSubmit}>
//           <select
//             name="country"
//             id="country"
//             onChange={handleCountryChangeLocal}
//             className="px-3 mr-3 bg-gray-300 rounded font-medium"
//           >
//             <option value="--Select Country--">--select Country--</option>
//             {data.map((item) => (
//               <option key={item.country} value={item.country}>
//                 {item.country}
//               </option>
//             ))}
//           </select>
//           <select
//             name="state"
//             id="state"
//             onChange={handleStateChangeLocal}
//             className="px-3 mr-3 bg-gray-300 rounded font-medium"
//           >
//             <option value="select State">--select state--</option>
//             {data
//               .find((item) => item.country === country)
//               ?.state?.map((state) => (
//                 <option value={state?.stateName} key={state.stateName}>
//                   {state?.stateName}
//                 </option>
//               ))}
//           </select>
//           <select
//             name="city"
//             id="city"
//             className="px-3 mr-3 bg-gray-300 rounded font-medium"
//             onChange={handleCityChangeLocal}
//           >
//             <option value="select city">--select city--</option>
//             {data
//               .find((item) => item.country === country)
//               ?.state.find((item) => item?.stateName === state)
//               ?.city?.map((city) => (
//                 <option value={city} key={city}>
//                   {city}
//                 </option>
//               ))}
//           </select>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DropDown;
