var nav = ReactMeteor.createClass({
	templateName: "nav",

  startMeteorSubscriptions: function() {
  },

  getMeteorState: function() {
    return {
      board: boards.findOne({ title : 'First Board' })
    }
  },

  addList: function() {
    var newName = prompt("What is the name of the list?");
    var boardId = this.state.board._id;
    var newList = {
      title: newName,
      boardId: boardId,
      todos: []
    }
    var newListId = todoList.insert(newList);
    boards.update({_id:boardId}, {$push : { lists : newListId}})
  },

  render: function() {
    // var { description, ...rest } = this.props;
    return (
	    <div className="nav navbar navbar-inverse navbar-fixed-top">
				<div className="container-fluid">
					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
							<div className="sr-only"> Toggle navigation </div>
							<div className="icon-bar"> </div>
							<div className="icon-bar"> </div>
							<div className="icon-bar"> </div>
						</button>
						<a className="navbar-brand" href="#"> react + meteor + trello </a>
					</div>
					<div className="collapse navbar-collapse bs-example-navbar-collapse-1 navbar-right">
						<span className="label">	
							New List   
						</span>
						<button className="btn btn-default navbar-btn" type="button" onClick={this.addList}>
	            <span className="glyphicon glyphicon-plus"></span>
	          </button>
					</div>
				</div>
			</div>
		);
	}
});