todoList = new Mongo.Collection("todos");
boards = new Mongo.Collection("boards");
var cx = React.addons.classSet;

var Board = ReactMeteor.createClass({
  templateName: "Board",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("boards");
  },

  getMeteorState: function() {
    return {
      board: boards.findOne({ title : 'First Board' })
    };
  },

  renderList: function(model) {
    var todos = todoList.findOne({_id: model});
    return (
      <TodoList
        key={todos._id}
        title={todos.title}
        todos={todos.todos}
        board={this.state.board}
        id={todos._id}
        className="flex-item"
      />
    );
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

  componentDidMount: function() {
    // createSortable('.flex-container');
    $($('.flex-container')[0]).sortable();
  },

  render: function() {
    return (
      <div className='col-xs-12'>
        <h1>{this.state.board.title}</h1>
        <div className="flex-container">
          { this.state.board.lists.map(this.renderList) }
          <button className="btn btn-default" type="button" onClick={this.addList}>
            <span className="glyphicon glyphicon-plus"></span>
          </button>
        </div>
      </div>
    );
  }
});

var TodoList = ReactMeteor.createClass({
  templateName: "TodoList",

  startMeteorSubscriptions: function() {
    // Meteor.subscribe("todos", this.props.title);
  },

  getMeteorState: function() {
    return {
      todos: todoList.findOne({_id:this.props.id}).todos
    };
  },

  addTodo: function() {
    var className = '.' + this.props.title.replace(/ /g,'') + '-newTodo';
    var newTodo = { 
      description : $(className).val() 
    };

    todoList.update(
      { _id : this.props.id },
      { $push : { todos : newTodo } }
    );
    $(className).val('');
  },

  selectTodo: function(id) {
    Session.set("selected_todo", id);
  },

  renderTodo: function(model, i) {
    return <Todo
      key={i}
      description={model.description}
      id={this.props.id}
      board={this.props.board}
      onClick={this.selectTodo.bind(this, model._id)}
    />;
  },

  deleteList: function() {
    boards.update(
      { _id : this.props.board._id},
      { $pull: { lists : this.props.id } }
    );
  },

  componentDidMount: function() {
    // createSortable('#' + this.getDOMNode().id + ' .panel-body');
    // $('#' + this.getDOMNode().id + ' .panel-body').sortable();
    $($('#' + this.getDOMNode().id + ' .panel-body')[0]).sortable();
  },

  render: function() {
    var children = [];
    var { title, todos, board, ...rest } = this.props;
    var inputClass = title.replace(/ /g,'') + '-newTodo form-control ';
    var wrapperClass = "flex-item " + this.props.title;
    return <div {...rest} className={wrapperClass}>
      <div className="panel panel-default">
        <div className="panel-heading">
          {title}
          <span className="glyphicon glyphicon-remove pull-right" onClick={this.deleteList}></span>
        </div>
        <div className="panel-body">
          { this.state.todos.map(this.renderTodo) }
         <div className="input-group">
            <input type="text" className={inputClass} placeholder="Search for..."/>
            <span className="input-group-btn">
              <button className="btn btn-default" type="button" onClick={this.addTodo}>Add!</button>
            </span>
          </div>
        </div>
      </div>
    </div>;
  }
});

var Todo = React.createClass({

  deleteTodo: function() {
    todoList.update(
      {_id:this.props.id},
      { $pull: { todos : { description: this.props.description } } }
    );
  },
  render: function() {
    var { description, ...rest } = this.props;
    return <div  {...rest} className={cx("panel panel-default sortable", rest.className)}>
      <div className="panel-body">
        {description}
        <span className="glyphicon glyphicon-remove pull-right" onClick={this.deleteTodo}></span>
      </div>
    </div>;
  }
});
