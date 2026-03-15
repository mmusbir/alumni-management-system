const express = require('express');
const adminController = require('../controllers/adminController');
const { validateAdminLogin } = require('../middleware/validate');
const { requireAdminAuth } = require('../middleware/adminAuth');
const { uploadSiteAssets, uploadCsv } = require('../middleware/upload');

const router = express.Router();

router.post('/admin/login', validateAdminLogin, adminController.login);
router.post('/admin/logout', adminController.logout);
router.get('/admin/me', requireAdminAuth, adminController.me);
router.get('/admin/users', requireAdminAuth, adminController.getAdminUsers);
router.post('/admin/users', requireAdminAuth, adminController.createAdminUser);
router.put('/admin/users/:id', requireAdminAuth, adminController.updateAdminUser);
router.delete('/admin/users/:id', requireAdminAuth, adminController.deleteAdminUser);
router.get('/admin/dashboard', requireAdminAuth, adminController.getDashboard);
router.get('/admin/alumni-options', requireAdminAuth, adminController.getAlumniOptions);
router.get('/admin/alumni', requireAdminAuth, adminController.getAlumni);
router.post('/admin/alumni', requireAdminAuth, adminController.createAlumni);
router.put('/admin/alumni/:id', requireAdminAuth, adminController.updateAlumni);
router.post('/admin/alumni/:id/verify', requireAdminAuth, adminController.verifyAlumni);
router.delete('/admin/alumni/:id', requireAdminAuth, adminController.deleteAlumni);
router.get('/admin/usaha', requireAdminAuth, adminController.getUsaha);
router.post('/admin/usaha', requireAdminAuth, adminController.createUsaha);
router.put('/admin/usaha/:id', requireAdminAuth, adminController.updateUsaha);
router.post('/admin/usaha/:id/verify', requireAdminAuth, adminController.verifyUsaha);
router.delete('/admin/usaha/:id', requireAdminAuth, adminController.deleteUsaha);
router.get('/admin/site-settings', requireAdminAuth, adminController.getSiteSettings);
router.put(
  '/admin/site-settings',
  requireAdminAuth,
  uploadSiteAssets.fields([
    { name: 'favicon_file', maxCount: 1 },
    { name: 'logo_file', maxCount: 1 },
    { name: 'hero_file', maxCount: 1 },
  ]),
  adminController.updateSiteSettings,
);
router.get('/admin/alumni/import-template', requireAdminAuth, adminController.downloadAlumniImportTemplate);
router.post('/admin/alumni/import', requireAdminAuth, uploadCsv.single('file'), adminController.importAlumni);
router.get('/admin/lapak-categories', requireAdminAuth, adminController.getLapakCategories);
router.post('/admin/lapak-categories', requireAdminAuth, adminController.createLapakCategory);
router.put('/admin/lapak-categories/:id', requireAdminAuth, adminController.updateLapakCategory);
router.delete('/admin/lapak-categories/:id', requireAdminAuth, adminController.deleteLapakCategory);
router.get('/admin/provinces', requireAdminAuth, adminController.getProvinces);
router.post('/admin/provinces', requireAdminAuth, adminController.createProvince);
router.put('/admin/provinces/:id', requireAdminAuth, adminController.updateProvince);
router.delete('/admin/provinces/:id', requireAdminAuth, adminController.deleteProvince);
router.get('/site-settings', adminController.getPublicSiteSettings);
router.get('/lapak-categories', adminController.getLapakCategories);
router.get('/provinces', adminController.getProvinces);

module.exports = router;
