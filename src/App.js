import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter , Link, NavLink, Route ,Routes, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AddBook, deleteBook, loadBooks, logIn, SetA, SetC, setClickToEdit, setClickToEditToFalse, SetD, setIdToEdit, setSearchInput, SetT, updateBook } from './books_details/bookSlice';
import text from './books_details/book_text'
function App() {
  const books = useSelector(state=>state.book.books)
  let log =  useSelector(state=>state.book.isLogIn)  
  return (
    <BrowserRouter>
     <Header log={log} />    
     <Routes>
      <Route path='/Book-Store-CRUD' element={<Control books={books} log={log}/>}></Route>
      <Route path="/Book-Store-CRUD/read/:bookId_param" element={<ReadPage books={books} />}></Route> 
     </Routes>  
    </BrowserRouter>     
  );
}

function Header(props){
  let dispatch = useDispatch()
  function handleSearchChange(e){
    dispatch(setSearchInput(e.target.value))
  }
 
  return (
    <header className='container-fluid header bg-secondary sticky-top'>
      <div className='row'>
        <div className="col-lg-4 col-md-4 col-sm-4">
          <div className='logo text-white'>
             <Link to='/Book-Store-CRUD' className='btn text-white'><p><span className='h2 fw-bold'>Book</span> store</p></Link>
          </div>
        </div>
        <div className="col-lg-5 col-md-4 col-sm-4">
          <input type="search" onChange={handleSearchChange}  placeholder=' search for book' className='form-control mt-3'/>    
        </div>
        <div className="col-lg-3 col-md-4 col-sm-4 text-end">
           <button className='btn btn-outline-info mt-3' onClick={()=>dispatch(logIn())}>{props.log ? "Log In" : "Log Out"}</button>
        </div>        
      </div>        
    </header>
  )
}

function Form(props){
const dispatch = useDispatch()
function handleChangeT(e){dispatch(SetT(e.target.value))}
function handleChangeA(e){dispatch(SetA(e.target.value))}
function handleChangeC(e)
{
  dispatch(SetC(e.target.options[e.target.value].text))
}
function handleChangeD(e){dispatch(SetD(e.target.value))}
const dis = useDispatch()
  let handleAdd = (e)=>{  
    e.preventDefault()
     dis(AddBook({
      author : props.author,
      title : props.title,
      description : props.description,
      catagory : props.catagory
     }))
     dispatch(SetT("")); dispatch(SetC(""));
     dispatch(SetD("")); dispatch(SetA(""))
  }


let idToback = useSelector(state=>state.book.idToEdit)
let select = document.getElementById('select')

function handleConfirm(){
  dispatch(setClickToEditToFalse())
    const updatedBook = {
      title : props.title,
      author :  props.author,
      description: props.description,
      catagory :  props.catagory
    }
  console.log(props.idToEdit)
    dispatch(updateBook([updatedBook ,idToback]))
    dispatch(SetT(""))
    dispatch(SetD(""))
    dispatch(SetA(""))
    dispatch(SetC("")) 
    select.value = '0'
}

function handleCancel(){
  dispatch(setClickToEditToFalse())
  dispatch(SetT(""))
  dispatch(SetD(""))
  dispatch(SetA(""))
  dispatch(SetC(""))
  select.value = '0'
}

  return (     
   <div className='container mt-5' id="form" role="region" aria-labelledby='form'>
    <div className='row'>
      <div className='col-lg-3 col-md-2 col-sm-1'></div>
      <div className='col-lg-6 col-md-8 col-sm-10'>
      
      <div className="form-floating mb-3 mt-3">
        <input type="text" onChange={handleChangeA} value={props.author} className="form-control" id="auth" placeholder="Author" name="author" disabled={props.log && "disabled"}/>
        <label htmlFor="auth">Author</label>
      </div>
      <div className="form-floating mt-3 mb-3">
        <input type="text" onChange={handleChangeT} value={props.title} className="form-control" id="ti" placeholder="Title" name="title"  disabled={props.log && "disabled"}/>
        <label htmlFor="ti">Title</label>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleFormControlTextarea1" className="form-label text-white">Description</label>
        <textarea className="form-control" onChange={handleChangeD} value={props.description} id="exampleFormControlTextarea1" rows="3" disabled={props.log && "disabled"}></textarea>
      </div>
     
      <select className="form-select form-select-lg mb-3"  onChange={handleChangeC}  aria-label=".form-select-lg example" disabled={props.log && "disabled"} id="select" >
        <option defaultValue disabled value='0'>Catagory</option>
        <option  value="1">History</option>
        <option  value="2">Science</option>
        <option  value="3">Health</option>
        <option  value="4">None</option>
      </select>
          <button className='btn btn-primary' onClick={handleAdd} disabled={props.log && "disabled"}>Add</button>

          {props.toEdit && <a href={"#"+idToback}><button onClick={handleConfirm} className='btn btn-warning'  disabled={props.log && "disabled"}>Confirm</button></a>}
          {props.toEdit && <a href={"#"+idToback}><button onClick={handleCancel} className='btn btn-secondary'  disabled={props.log && "disabled"}>Cancel</button></a>}

      </div>
      <div className='col-lg-3 col-md-2 col-sm-1'></div>
    </div>
   </div>
  )
}

let BookList = (props)=>{
  
  const dispatch = useDispatch()
  let searchInput = useSelector(state=>state.book.searchInput)
  let load = useSelector(state=>state.book.loading)
  useEffect(() => {
    dispatch(loadBooks())
  } , [dispatch]);
  
  function handleClick(e){ 
    dispatch(deleteBook(e.target.id))
  }

  function handleEdit(e){
    dispatch(setClickToEdit(e.target.value))
    dispatch(setIdToEdit(Number(e.target.id)))
    let findTargetBook = props.books.filter((book)=>{
      if(book.id == e.target.id){
         return book
      }
    })[0]
    console.log(findTargetBook)
    dispatch(SetT(findTargetBook.title))
    dispatch(SetD(findTargetBook.description))
    dispatch(SetA(findTargetBook.author))
    dispatch(SetC(findTargetBook.catagory)) 
    let sel = document.getElementById('select')
    let x = '0'
    if(findTargetBook.catagory=="History"){x = '1'}
    if(findTargetBook.catagory=="Health"){x = '3'}
    if(findTargetBook.catagory=="Science"){x = '2'}
    if(findTargetBook.catagory=="None"){x = '4'}
    sel.value = x
   
  }  


  function isContain(arr , val){
    for (let i = 0; i < arr.length; i++) {  
      if(arr[i].id  == val){
        return true
      }
    }
    return false
  }
  let items = ""
  if( props.books != null){
    items = props.books.map((book)=>{
      return (
     <div className='row' key={book.id} role="region" aria-labelledby='{book.id}'>
      <div className='col-lg-2 col-md-1 col-sm-0'></div>
         <div className='col-lg-8  col-md-10  col-sm-12'>          
            <div className="container-fluid alert alert-secondary alert-dismissible fade show">
              <div className='row'>
              <div className="col-lg-8 col-md-12 col-sm-12">
                <strong className="text-dark fw-bold h3">{book.title}</strong>
                <p>{book.description}</p> -{book.catagory}
              </div>
              <div className="col-lg-4 col-md-0 col-sm-0">
                <div className="btn-group-sm text-end" role="group" aria-label="Basic mixed styles example">
                  <button type="button" className='btn btn-danger' onClick={handleClick} data-bs-dismiss="alert" id={book.id} disabled={props.log && "disabled"}>Delete</button>
                  <a href='#form'><button type="button" className="btn btn-warning" onClick={handleEdit} disabled={props.log && "disabled"} id={book.id}>Edit</button></a>
                  <Link to={'/Book-Store-CRUD/read/'+book.id} type="button" className="btn btn-success" id={book.id}>Read</Link>
                </div>
              </div>       
              </div>                
            </div>
         </div>
         <div className='col-lg-2 col-md-1 col-sm-0'></div>
      </div>
      ) 
  })
 
  }

  //For Searh
  searchInput = searchInput.trim() 
  if(searchInput!=""){ 
     let successfulKeys = props.books.filter((book)=>{
      if(book.title.includes(searchInput) || book.author.includes(searchInput) || book.description.includes(searchInput) || book.catagory.includes(searchInput))
      {
         return book
      }
    })
     let Newitems = items.filter((elem)=>{
          if(isContain(successfulKeys , elem.key)){
             return elem
          }  
     }) 
    items = Newitems
  }

  return(
    <div className='container mt-3 border-top pt-3'>
      {load && <p className='display-6 fw-bold text-info'>Loading....</p>}
      {props.books == null && <p className='display-6 fw-bold text-info'>There is no books</p>}
      {items}   
    </div>
  )
}

let ReadPage = (props)=>{
  const idParam = useParams()
  console.log(idParam.bookId_param) 
  let bookToRead = props.books.filter((book)=>{
    if(book.id == idParam.bookId_param){
       return book
    }
  })[0]
  console.log(bookToRead)
  return (
    
    <div className="container mt-5 text-center border-start border-info p-3" style={{height:'550px' , overflow:'auto'}}>
       <div className="row">
          <div className="col-lg-12 text-white">
            <p>Author - <span className='display-6 fw-bold text-info'>{bookToRead.author}</span> 
                 ............... Title - 
            <span className='display-6 fw-bold text-info'>{bookToRead.title}</span>
            ................
            Catagory - <span className='display-6 fw-bold text-info'>{bookToRead.catagory}</span>
            </p>
            <p>description -   <span className='fs-18 fw-bold text-info'>{bookToRead.description}</span></p>
            <hr></hr>
          </div>          
       </div>
      <div className="row">
        <div className="col-lg-2"></div>
        <div className="col-lg-8">
          <h2 className="text-white"><span className='display-4 fw-bold text-primary'>{bookToRead.title}</span></h2>
          <p className="text-white">    
          </p>                  
        </div>
        <div className="col-lg-2"></div>
      </div>  
      <div className="row">
      <div className="col-12"><p className='text-white'>{text}{text}</p></div>
      </div>
    </div>
  )
}

let Control = (props)=>{
let title = useSelector(state=>state.book.title)
let author = useSelector(state=>state.book.author)
let catagory = useSelector(state=>state.book.catagory)
let description = useSelector(state=>state.book.description)
let toEdit = useSelector(state=>state.book.clickToEdit)
  return(
    <>
    <Form log={props.log} title={title} author={author} catagory={catagory} description={description}  toEdit={toEdit}/>
    <BookList books={props.books} log={props.log} title={title} author={author} catagory={catagory} description={description}  toEdit={toEdit} />
    </>
  )
}
export default App;
