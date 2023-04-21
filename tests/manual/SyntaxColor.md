# Manual test: Verify that syntax color is applied on files

Steps:

1. Go to the homepage
2. Create project from scratch
3. Create model from scratch on `terrator-plugin`
4. Go to the text editor page
5. In current model folder, create these files:
   - `test.cs` with this content: `namespace RayTracer {}`
   - `test.css` with this content: `p { color: red; text-align: center; }`
   - `test.html` with this content: `<html></html>`
   - `test.java` with this content: `public class HelloWorld {}`
   - `test.js` with this content: `export default {};`
   - `test.json` with this content: `{ "test": "a" }`
   - `test.md` with this content: `# title`
   - `test.python` with this content: `from Tkinter   import *`
   - `test.ruby` with this content: `def polyval(x, coef)`
   - `test.ts` with this content: `function welcome(user: Account) { console.log(user.id); }`
   - `test.tf` with this content: `provider "aws" {}`
6. Verify for all previous files that the syntax color is present
