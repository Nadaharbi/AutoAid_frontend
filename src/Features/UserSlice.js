import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addUser=createAsyncThunk("counter/addUser",async(userData)=>{
    try{
            const response=await axios.post("http://127.0.0.1:8080/insertUser",{
                uname:userData.uname,
                password:userData.password,
                email:userData.email,
                pic:userData.pic
            });
            const msg=response.data;
            return msg;

    }
    catch(error)
    {
        console.log(error);
    }
});
// update password:
export const updateUser = createAsyncThunk('counter/updateUser', async (userData) => {
  try {
    const response = await axios.put('http://127.0.0.1:8080/updateUser', {
      uname: userData.uname,
      password: userData.password,
      email: userData.email,
      currentPassword: userData.currentPassword, // Send current password for verification
      newPassword: userData.newPassword // Send new password for update
    });
    return response.data; // Return success message from the backend
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

// get user
export const getUser = createAsyncThunk("counter/getUser", async (userData) => {
  try {
      const response = await axios.post("http://127.0.0.1:8080/login", {
          password: userData.password,
          email: userData.email,
      });

      return response.data.user; // Make sure this is the correct response
  } catch (error) {
      console.log(error);
      return {}; // Return empty object on error
  }
});


// logout
export const logout = createAsyncThunk("counter/logout", async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8080/logout");
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(error); // Throw error to be caught by .unwrap()
    }
  });
 
export const addService=createAsyncThunk("counter/addService",async(serviceData)=>{});

const initValue = {
    user:{},
    message:"",
    isLoading:false,
    isSuccess:false,
    isError:false
}

export const UserSlice=createSlice({
    name:"counter",
    initialState:initValue,

    extraReducers:(builder)=>{
        builder.addCase(addUser.pending,(state)=>{
                state.isLoading=true;
            })
            .addCase(addUser.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.isSuccess=true;
                state.message=action.payload;
            })
            .addCase(addUser.rejected,(state)=>{
                state.isLoading=false;
                state.isError=true;
            }).addCase(getUser.pending,(state)=>{
                state.isLoading=true;
            })
            .addCase(getUser.fulfilled, (state, action) => {
              state.isLoading = false;
              state.isSuccess = true;
              state.user = action.payload; // Make sure the user is stored correctly
            })
            .addCase(getUser.rejected,(state)=>{
                state.isLoading=false;
                state.isError=true;
            })// Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = {}; // Reset user on successful logout
              })// Update Password
              .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
              })
              .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message; // Store the success message here
              })
              .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message; // Store the error message here
              }) ;
    }
});
export default UserSlice.reducer;