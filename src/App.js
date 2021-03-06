import React from 'react';
import axios from 'axios';
import './App.css';

// const list = [
//   {
//     title: 'React',
//     url: '#',
//     author: 'Jordan Walke',
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   },
//   {
//     title: 'Redux',
//     url: '#',
//     author: 'Binh Trinh',
//     num_comments: 5,
//     points: 10,
//     objectID: 1,
//   },
// ];

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP='100';

const PATH_BASE = 'http://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

// const isSearched = searchTerm => item =>
//   item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchTerm: DEFAULT_QUERY,
      searchKey: '',
      error: null,
    };
  }

  onDismiss = (id) => {
    const {searchKey, results} = this.state;
    const {hits,page} = results[searchKey];
    const isNotId = item => item.objectID !== id;
    
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: {
        ...results,
        [searchKey]: {hits: updatedHits, page}
      }
    });
  }

  needsToSearchTopStories = (searchTerm) => 
    !this.state.results[searchTerm];

  onSearchSubmit = (event) => {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  fetchSearchTopStories = (searchTerm, page = 0) => {
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(result => this.setSearchTopStories(result.data))
    .catch(error => this.setState({error: error}));
  }
  
  setSearchTopStories = (result) => {
    const {hits, page} = result;
    const {searchKey, results} = this.state;
    const oldHits = results && results[searchKey] 
      ? results[searchKey].hits
      : [];
    const updatedHits = [
      ...oldHits,
      ...hits
    ]
    this.setState({
      results: {
        ...results,
        [searchKey]: {hits: updatedHits, page}
      }
    });
    console.log(results);
  }

  componentDidMount() {
    const {searchTerm} = this.state;
    this.setState({
      searchKey: searchTerm,
    });
    this.fetchSearchTopStories(searchTerm);
  }

  

  onSearchChange = (event) => {
    this.setState({
      searchTerm: event.target.value,
    });
  }


  render() {
    const {results, searchTerm, searchKey, error} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (
      results && 
      results[searchKey] && 
      results[searchKey].hits
    ) || [];
    return (
      <div className="page">
        <div className="interactions">
          <Search
          value={searchTerm}
          onChange={this.onSearchChange}
          onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {error 
          ? <div className="interactions">
              <p>Something went wrong.</p>
            </div>
          : <Table 
              list={list}
              onDismiss={this.onDismiss}
            />
        }
        

        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchTerm, page+1)}
          >
            More
          </Button>
        </div>
        
      </div>
    )
  }
}

const Search = ({value, onChange, onSubmit, children}) => 
  <form onSubmit={onSubmit}>
    {children} <input 
    type="text" 
    value={value}
    onChange={onChange}
    />
    <button type="submit">{children}</button>
  </form>
  



const Table = ({list, onDismiss}) => {
  const largeColumn = {
    width: '40%',
  };

  const midColumn = {
    width: '30%',
  };

  const smallColumn = {
    width: '10%',
  };
  return (
    <div className="table">
    {list.map(item => 
      <div key={item.objectID} className="table-row">
        <span style={largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={midColumn}>{item.author}</span>
        <span style={smallColumn}>{item.num_comments}</span>
        <span style={smallColumn}>{item.points}</span>
        <span style={smallColumn}>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className = "button-inline"
          > 
            Dismiss
          </Button>
          
        </span>
      </div>  
    )}
    </div>
  );
}
  
  
 
  


const Button = ({onClick, className = '', children}) => {

  return (
    <button
        onClick={onClick}
        className = {className}
        type="button"
      >
      {children}
      </button>
  );
}
  
    
  


export default App;