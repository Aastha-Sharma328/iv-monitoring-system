const router = require('./src/routes/deviceRoutes');
console.log(router.stack.map(layer => ({ path: layer.route && layer.route.path, methods: layer.route && Object.keys(layer.route.methods) })));
