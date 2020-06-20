/** @jsx MiniReact.createElement */

// the  @jsx param directive tells Babel to use MiniReact.createElement
// instead of React.createElement when transpiling code


const root = document.getElementById("root");

// Tests whether the jsx is correctly transpiled to equivalent MiniReact element
// - jsx representation of the real DOM to be created
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

console.log(Step1);

MiniReact.render(Step1, root);