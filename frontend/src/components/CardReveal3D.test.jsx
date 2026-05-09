// frontend/src/components/CardReveal3D.test.jsx
// ეს ფაილი მხოლოდ დიაგნოსტიკისთვის - არ იმპორტდება აპში

// ტესტი 1: კომპონენტი იმპორტდება?
try {
    import('./CardReveal3D').then(() => {
      console.log('✅ CardReveal3D: Import successful');
    }).catch(e => {
      console.error('❌ CardReveal3D: Import failed:', e.message);
    });
  } catch (e) {
    console.error('❌ CardReveal3D: Static import failed:', e.message);
  }
  
  // ტესტი 2: framer-motion მუშაობს?
  try {
    import('framer-motion').then(() => {
      console.log('✅ framer-motion: Available');
    }).catch(() => {
      console.error('❌ framer-motion: Not installed. Run: npm install framer-motion');
    });
  } catch (e) {
    console.error('❌ framer-motion: Import failed:', e.message);
  }
  
  // ტესტი 3: ფუნქციის გადაცემა მუშაობს?
  const testFunction = () => {
    console.log('✅ Function passing: Works');
    return true;
  };
  
  const simulateClick = (handler) => {
    try {
      if (typeof handler === 'function') {
        handler();
        return true;
      }
      return false;
    } catch (e) {
      console.error('❌ Function execution failed:', e.message);
      return false;
    }
  };
  
  simulateClick(testFunction);