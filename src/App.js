import React from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: '#',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: '#',
    author: 'Binh Trinh',
    num_comments: 5,
    points: 10,
    objectID: 1,
  },
];

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: list,
      searchTerm: '',
    };
  }

  onDismiss = (id) => {
    const isNotId = (item) => {
      return item.objectID !== id;
    }
    const updatedList = this.state.list.filter(isNotId);
    this.setState({
      list: updatedList,
    });
  }

  onSearchChange = (event) => {
    this.setState({
      searchTerm: event.target.value,
    });
    console.log(this.state.searchTerm);
  }


  render() {
    const {list, searchTerm} = this.state;
    return (
      <div className="page">
        <div className="interactions">
          <Search
          value={searchTerm}
          onChange={this.onSearchChange}
          >
            Search
          </Search>
        </div>
        <Table 
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
        
      </div>
    )
  }
}

const Search = ({value, onChange, children}) => 
  <form>
    {children} <input 
    type="text" 
    value={value}
    onChange={onChange}
    />
  </form>
  



const Table = ({list, pattern, onDismiss}) => {
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
    {list.filter(isSearched(pattern)).map(item => 
      <div key={item.objectID} className="table-row">
        <span style={largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={midColumn}>{item.author}</span>
        <span style={smallColumn}>{item.num_comments}</span>
        <span style={smallColumn}>{item.points}</span>
        <span style={smallColumn}>
          <Button
            onclick={() => onDismiss(item.objectID)}
            className = "button-inline"
          > 
            Dismiss
          </Button>
          
        </span>
      </div>  
    )}
    </div>
  )
}
  
  
 
  


const Button = ({onClick, className = '', children}) => 
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>
    
  


export default App;