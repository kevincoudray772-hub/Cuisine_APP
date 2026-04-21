const DB = {
  // --- Stock ---
  getStock() {
    return JSON.parse(localStorage.getItem('stock') || '[]');
  },

  saveStock(stock) {
    localStorage.setItem('stock', JSON.stringify(stock));
  },

  addIngredient(ingredient) {
    const stock = this.getStock();
    const existing = stock.find(i => i.barcode === ingredient.barcode && ingredient.barcode);
    if (existing) {
      existing.quantity += ingredient.quantity;
      existing.unit = ingredient.unit;
    } else {
      stock.push({ ...ingredient, id: Date.now() });
    }
    this.saveStock(stock);
  },

  updateIngredient(id, changes) {
    const stock = this.getStock();
    const idx = stock.findIndex(i => i.id === id);
    if (idx !== -1) {
      stock[idx] = { ...stock[idx], ...changes };
      this.saveStock(stock);
    }
  },

  deleteIngredient(id) {
    const stock = this.getStock().filter(i => i.id !== id);
    this.saveStock(stock);
  },

  decrementIngredients(ingredients) {
    const stock = this.getStock();
    ingredients.forEach(({ name, quantity }) => {
      const item = stock.find(i =>
        i.name.toLowerCase().trim() === name.toLowerCase().trim()
      );
      if (item) {
        item.quantity = Math.max(0, item.quantity - quantity);
      }
    });
    this.saveStock(stock);
    this.checkLowStock();
  },

  checkLowStock() {
    const stock = this.getStock();
    const courses = this.getCourses();
    let updated = false;
    stock.forEach(item => {
      if (item.quantity <= item.threshold && item.threshold > 0) {
        const already = courses.find(c => c.name === item.name);
        if (!already) {
          courses.push({
            id: Date.now() + Math.random(),
            name: item.name,
            unit: item.unit,
            done: false
          });
          updated = true;
        }
      }
    });
    if (updated) this.saveCourses(courses);
  },

  // --- Courses ---
  getCourses() {
    return JSON.parse(localStorage.getItem('courses') || '[]');
  },

  saveCourses(courses) {
    localStorage.setItem('courses', JSON.stringify(courses));
  },

  addCourse(item) {
    const courses = this.getCourses();
    courses.push({ ...item, id: Date.now(), done: false });
    this.saveCourses(courses);
  },

  toggleCourse(id) {
    const courses = this.getCourses();
    const item = courses.find(c => c.id === id);
    if (item) item.done = !item.done;
    this.saveCourses(courses);
  },

  deleteCourse(id) {
    this.saveCourses(this.getCourses().filter(c => c.id !== id));
  },

  clearDoneCourses() {
    this.saveCourses(this.getCourses().filter(c => !c.done));
  }
};
