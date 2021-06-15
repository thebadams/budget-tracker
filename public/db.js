let db
let version = 2

const req = indexedDB.open('BudgetTrackerDB', version)
req.onerror = (e) => {
  console.log(`Database Version ${version} has failed to open`);
}
req.onsuccess = (e) => {
  console.log(`Database Version ${version} has been opened`);
} 
req.onupgradeneeded = (e) => {
  db = e.target.result;
  const {oldVersion, newVersion} = e;
  console.log(`Database Has Been Upgraded From ${oldVersion} to ${newVersion}`)
  db.createObjectStore('BudgetTrackerStore')
}