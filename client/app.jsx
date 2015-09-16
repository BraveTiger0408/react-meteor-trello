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

  componentDidMount: function() {
    // createSortable('.flex-container');
    // $($('.flex-container')[0]).sortable();
  },

  render: function() {
    return (
      <div className='col-xs-12'>
        <h1>{this.state.board.title}</h1>
        <div className="flex-container">
          { this.state.board.lists.map(this.renderList) }
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
    var current = todoList.findOne({_id:this.props.id});
    return {
      todos: current.todos,
      title: current.title,
      needEdit: Session.get("TargetValue" + this._reactInternalInstance._rootNodeID)
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
      index={i}
      onClick={this.selectTodo.bind(this, model._id)}
    />;
  },

  deleteList: function() {
    boards.update(
      { _id : this.props.board._id},
      { $pull: { lists : this.props.id } }
    );
  },

  handleDoubleClick: function(evt, id) {
    console.log('here', evt, id)
    return Session.set("TargetValue" + this._reactInternalInstance._rootNodeID, true)
  },

  save: function() {
    var newValueFromInput = document.getElementById('newValueFromInput').value;
    todoList.update(
      {_id:this.props.id},
      { $set: { title : newValueFromInput} }
    );
    return Session.set("TargetValue" + this._reactInternalInstance._rootNodeID,false); //we hide the input and we put the span again
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
    var editable;
    if(this.state.needEdit) {
      console.log('newnew')
      editable = <div className="inline">
        <input type="text" id="newValueFromInput"  defaultValue={title} />
        <button className="btn btn-sm btn-primary" id="buttonToSaveNewValue" type="submit" onClick={this.save}>Save</button>
      </div>
    } else {
      editable = this.state.title
    }

    return <div {...rest} className={wrapperClass}>
      <div className="panel panel-default">
        <div className="panel-heading" onDoubleClick={this.handleDoubleClick}>
          {editable}
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

var Todo = ReactMeteor.createClass({
  templateName: "todo",

  getMeteorState: function() {
    console.log(this._reactInternalInstance._rootNodeID)
    return {
      needEdit: Session.get("TargetValue" + this._reactInternalInstance._rootNodeID)
    };
  },

  deleteTodo: function() {
    todoList.update(
      {_id:this.props.id},
      { $pull: { todos : { description: this.props.description } } }
    );
  },

  save: function() {
    //here you can take the emailId and the name based on this._id like this Collection.find({_id:this._id}).fetch(); and do the updates you want to do
    var newValueFromInput = document.getElementById('newValueFromInput').value;
    var update = {} 
    update['todos.'+this.props.index+'.description'] = newValueFromInput
    todoList.update(
      {_id:this.props.id},
      { $set: update }
    );
    return Session.set("TargetValue" + this._reactInternalInstance._rootNodeID,false); //we hide the input and we put the span again
  },

  handleDoubleClick: function(evt, id) {
    return Session.set("TargetValue" + id, true)
  },

  render: function() {
    var { description, ...rest } = this.props;
    var editable;
    var desc = '';
    desc+= description;
    if(this.state.needEdit) {
      editable = <div className="inline">
        <input type="text" id="newValueFromInput"  defaultValue={description} />
        <button className="btn btn-sm btn-primary" id="buttonToSaveNewValue" type="submit" onClick={this.save}>Save</button>
      </div>
    } else {
      editable = description
    }

    return <div onDoubleClick={this.handleDoubleClick} className={cx("panel panel-default sortable todo", rest.className)}>
      <div className="panel-body">
        {editable}
        <span className="glyphicon glyphicon-remove pull-right" onClick={this.deleteTodo}></span>
      </div>
    </div>;
  }
});
