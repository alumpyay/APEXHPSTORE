const fs = require('fs');
let content = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

content = content.replace(
  /const loginAdmin = async \(\) => \{\s*try \{\s*await signInWithPopup\(auth, googleProvider\);\s*return true;\s*\} catch \(error: any\) \{\s*console\.error\(error\);\s*throw error;\s*\}\s*\};/,
  `const loginAdmin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== 'alumpy841@gmail.com') {
        await signOut(auth);
        throw new Error("Unauthorized access. Your email is not authorized for the admin portal.");
      }
      return true;
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  };`
);

fs.writeFileSync('src/context/StoreContext.tsx', content);
console.log("Patched loginAdmin");
