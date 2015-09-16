todoList = new Mongo.Collection("todos");
todoList.allow({
  'insert': function() {
    return true;
  },
  'update': function() {
    return true;
  },
  'remove': function() {
    return true;
  },
});

// Meteor.publish("todos", function() {
// 	return todoList.find();
// });

boards = new Mongo.Collection("boards");
boards.allow({
  'insert': function() {
    return true;
  },
  'update': function() {
    return true;
  },
  'remove': function() {
    return true;
  },
});

// Meteor.publish("todos", board, function() {
// 	return board.find({title: board});
// });

function newList(boardId, name) {
  return todoList.insert({
    boardId: boardId,
    title: name,
    todos: [
      {description: name + "todo"}
    ]
  });
}

Meteor.startup(function () {
    todoList.remove({})
    boards.remove({}) 

  	if(boards.find().count() < 1) {
  		var board1Id = boards.insert({
  			title: 'First Board',
  			lists: []
  		});
      var list1 = newList(board1Id, "First list");
      var list2 = newList(board1Id, "Second list");
      boards.update({_id:board1Id}, {$push : { lists : { $each : [list1, list2]}}})
  	} 
});