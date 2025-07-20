import React from "react";
import { assets } from "../assets/assets";

export const InputField = ({ type, placeholder, name, handleChange, address }) => {
  return (
    <input
      className="w-full border border-gray-300 px-2 py-2.5 rounded outline-none focus:ring-2 focus:border-primary transition text-gray-700"
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={handleChange}
      value={address[name]}
      required
    />
  );
};

const AddAddress = ()  => {
  const [address, setAddress] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  };
  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping{" "}
        <span className="font-semibold text-primary "> Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                type="text"
                address={address}
                name="firstName"
                placeholder="First Name"
              />
              <InputField
                handleChange={handleChange}
                type="text"
                address={address}
                name="lastName"
                placeholder="Last Name"
              />
            </div>
            <InputField
              handleChange={handleChange}
              type="email"
              address={address}
              name="email"
              placeholder="Email" />
            <InputField
              handleChange={handleChange}
              type="street"
              address={address}
              name="street"
              placeholder="Street Address"
            />  

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}   
                type={"text"}
                address={address}
                name="city"
                placeholder="City"
              />
              <InputField
                handleChange={handleChange}
                type={"text"}
                address={address}   
                name="state"
                placeholder="State" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                type={"text"}
                address={address}
                name="zipCode"
                placeholder="Zip Code"
              />
              <InputField
                handleChange={handleChange}
                type={"text"}
                address={address}
                name="country"
                placeholder="Country"
              />
            </div>
            <InputField
              handleChange={handleChange}
              type="text"
              address={address}
              name="phone"
              placeholder="Phone Number"
            />
            <button className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase rounded">
              Save address
            </button>
          </form>
        </div>
        <img src={assets.add_address_iamge} alt="pic" />
      </div>
    </div>
  );
};

export default AddAddress;
