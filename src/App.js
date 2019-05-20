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
]

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: list,
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

  render() {
    return (
      <div className="App">
        <form>
          <input type="text" />
        </form>
        {this.state.list.map(item => 
          <div key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
              <button
              onClick={() => this.onDismiss(item.objectID)}
              type="button"
              >
                Dismiss
              </button>
            </span>
          </div>  
        )}
      </div>
    )
  }
}

export default App;