console.log("%cHey there, curious explorer! 🐧", "color: green; font-size: 18px; font-weight: bold;");
console.log("This site is proudly made by a student who loves efficiency, control, and penguins.");
console.log(`
   .--.
  |o_o |
  |:_/ |
 //   \\ \\
(|     | )
/'\\_   _/\\'
\\___)=(___/
`);
console.log("Welcome to the Terminal Underground! 🐧");
let devtoolsOpen = false;
setInterval(() => {
  const widthThreshold = window.outerWidth - window.innerWidth > 100;
  const heightThreshold = window.outerHeight - window.innerHeight > 100;
  if (widthThreshold || heightThreshold) {
    if (!devtoolsOpen) {
      console.log("%cSpotted you with DevTools open! 👀", "color: orange; font-size: 16px;");
      devtoolsOpen = true;
    }
  }
}, 500);
