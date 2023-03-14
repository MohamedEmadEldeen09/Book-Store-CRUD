import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//
let url = "https://bookstore-api-u39j.onrender.com/Books"

//Load
export const loadBooks = createAsyncThunk('book/loadbooks' , async (_,ThunkApi)=>{
    try {
        const res = await fetch(url)
        if(!res.ok){           
          return null
        }
        const date = await res.json()
       return date
    } catch (error) {
        console.log(Error('Error'))
       console.log(ThunkApi.rejectWithValue)
       return null      
    }
})
//************** */
//Add
export const AddBook = createAsyncThunk('book/addbooks' , async (book )=>{
    try {
        const res = await fetch(url , {
            method :"POST",
            body : JSON.stringify(book),
            headers:{
                "Content-Type" : "application/json; charset=UTF-8"
            }                     
        })
        console.log(book)
        if(!res.ok){           
            console.log(Error('Error'))
        }     
        const get = await fetch(url)
         if(!get.ok){           
            console.log(Error('Error'))
            return null
         }  
        const data = await get.json()
        return data
    } catch (error) {
       console.log(Error('Error'))
       return null          
    }
})

//******************* */
//Delete
export const deleteBook = createAsyncThunk('book/deletebooks' , async (id)=>{
    try {
        const res = await fetch(url+"/"+id , {
            method :"DELETE",                   
        })
        if(!res.ok){           
            console.log(Error('Error'))
        }     
        const get = await fetch(url)
         if(!get.ok){           
            console.log(Error('Error'))
            return null
         }  
        const data = await get.json()
        return data
    } catch (error) {
       console.log(Error('Error'))
       return null          
    }
})
//********** */
//Update
export const updateBook = createAsyncThunk('book/updatebooks' , async (details)=>{
    try {
        const res = await fetch(url+"/"+details[1], {
            method :"PATCH",   
            body : JSON.stringify(details[0]),
            headers:{
                "Content-Type" : "application/json; charset=UTF-8"
            }                 
        })
        if(!res.ok){           
            console.log(Error('Error'))
        }     
        const get = await fetch(url)
         if(!get.ok){           
            console.log(Error('Error'))
            return null
         }  
        const data = await get.json()
        return data
    } catch (error) {
       console.log(Error('Error'))
       return null          
    }
})



//Reducer and State and Actions
const initS = {
   books : [] ,
   loading : false,
   isLogIn : true,
   title : "",
   author : "",
   description : "",
   catagory :"",
   clickToEdit : false,
   idToEdit : 1,
   searchInput :"",
   toSearch : false

}
export const bookSlice = createSlice({
    name : 'book',
    initialState :initS ,
    reducers:{
        logIn : (state)=>{
          state.isLogIn = !state.isLogIn
        },
        SetA : (state , action)=>{
            state.author = action.payload
        },
        SetC : (state , action)=>{
            state.catagory = action.payload
        },
        SetD : (state , action)=>{
            state.description = action.payload
        },
        SetT: (state , action)=>{
            state.title = action.payload
        },
        setClickToEdit : (state)=>{
         state.clickToEdit = true
        },
        setClickToEditToFalse : (state)=>{
            state.clickToEdit = false
        },
        setIdToEdit : (state , action)=>{
            state.idToEdit = action.payload
        },
        setSearchInput : (state , action)=>{
            state.searchInput = action.payload
        },
           
    },
    extraReducers :{
        [loadBooks.pending] : (state)=>{
            state.loading = true 
        },
        [loadBooks.fulfilled] : (state , action)=>{
            state.books = action.payload
            state.loading = false
        },
        [loadBooks.rejected] : (state)=>{
            state.loading = false
        } ,
        [AddBook.fulfilled] : (state , action)=>{
            state.books = action.payload
        },
        [deleteBook.fulfilled]:(state , action)=>{
            state.books = action.payload
        },
        [updateBook.fulfilled]:(state , action)=>{
            state.books = action.payload
        }
        
    }
})

//Export all the actions and the reducers
export const {logIn , SetA , SetD , SetT , SetC,setSearchInput , setClickToEdit ,setClickToEditToFalse, setIdToEdit} =  bookSlice.actions
export default bookSlice.reducer
