const fs = require('fs');
let content = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

content = content.replace(
  /const unsubscribeAuth = onAuthStateChanged\(auth, \(user\) => \{\s*setIsAdminLoggedIn\(\!\!user\);\s*\}\);/,
  `const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'alumpy841@gmail.com') {
        setIsAdminLoggedIn(true);
      } else {
        setIsAdminLoggedIn(false);
        if (user) {
          signOut(auth);
          alert("Unauthorized access. Your email is not authorized for the admin portal.");
        }
      }
    });`
);

fs.writeFileSync('src/context/StoreContext.tsx', content);
console.log("Patched StoreContext auth check");
