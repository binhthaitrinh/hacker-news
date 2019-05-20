import React from 'react';
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
      result: null,
      searchTerm: DEFAULT_QUERY,
    };
  }

  onDismiss = (id) => {
    const isNotId = item => item.objectID !== id;
    
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: Object.assign({}, this.state.result, {hits: updatedHits})
    });
  }

  onSearchSubmit = (event) => {
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  fetchSearchTopStories = (searchTerm, page = 0) => {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => error);
  }
  
  setSearchTopStories = (result) => {
    const {hits, page} = result;
    const oldHits = page !== 0 
      ? this.state.result.hits
      : [];
    const updatedHits = [
      ...oldHits,
      ...hits
    ]
    this.setState({
      result: {hits: updatedHits, page}
    });
  }

  componentDidMount() {
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  

  onSearchChange = (event) => {
    this.setState({
      searchTerm: event.target.value,
    });
  }


  render() {
    const {result, searchTerm} = this.state;
    const page = (result && result.page) || 0;
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
        { result
        ? <Table 
          list={result.hits}
          onDismiss={this.onDismiss}
        />
          : null
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