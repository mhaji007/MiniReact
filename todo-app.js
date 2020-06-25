
/** @jsx MiniReact.createElement */

// The entire library is contained in a top level namespace called MiniReact
// the  @jsx pragma directive tells Babel to use MiniReact.createElement
// instead of React.createElement when transpiling code
// This happens because babel looks at the  <script type="text/babel" src="./todo-app.js"></script>
// script tag defined in the index.html and
// anything written within "text/babel" or the referenced file
// will be handled by the babel script that is loaded in the browser
// This is sufficient for transpiling JSX to its equivalent in this library code
// 



const root = document.getElementById("root");

// Virtual DOM element. Sample jsx code to test whether the jsx is correctly transpiled to equivalent MiniReact element
// jsx representation of the real DOM to be created
var Step1 = (
    <div>
        <h1 className= "header"> Hello Mini React </h1>
        <h2> (Coding MiniReact) </h2>
        <div> nested 1<div>nested 1.1</div></div>
        <h3>(Notice: This will chnage)</h3>
        {2 == 1 && <div> Render this if 2==1</div>}
        {2 == 2 && <div>{2}</div> }
        <span>This is a text</span>
        <button onClick={()=>alert("Hi!")}>Click me!</button>
        <h3>This will be deleted</h3>
        2,3
        </div>
);

// Babel transpiles the entire call and the
// transpiled code is used here
console.log(Step1);

MiniReact.render(Step1, root);


var Step2 = (
    <div>
      <h1 className="header">Hello Tiny React!</h1>
      <h2>(coding nirvana)</h2>
      <div>nested 1<div>nested 1.1</div></div>
      <h3 style="background-color:yellow">(OBSERVE: I said it!!)</h3>
      {2 == 1 && <div>Render this if 2==1</div>}
      {2 == 2 && <div>{2}</div>}
      <span>Something goes here...</span>
      <button onClick={() => alert("This has changed!")}>Click me!</button>
    </div>
  );

  setTimeout(() => {
      alert("Re-rendering...");
      MiniReact.render(Step2, root)
      
  }, 4000);
