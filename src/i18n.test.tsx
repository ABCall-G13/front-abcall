import i18n from './i18n';

describe('i18n configuration', () => {
    test('should load English translations', () => {
        i18n.changeLanguage('en');
        expect(i18n.t('welcome')).toBe('Welcome to our service');
        expect(i18n.t('login')).toBe('Login');
        expect(i18n.t('register')).toBe('Register');
    });

    test('should load Spanish translations', () => {
        i18n.changeLanguage('es');
        expect(i18n.t('welcome')).toBe('Bienvenido a nuestro servicio');
        expect(i18n.t('login')).toBe('Iniciar sesión');
        expect(i18n.t('register')).toBe('Registrarse');
    });

    test('should fallback to English if translation is missing in Spanish', () => {
        i18n.changeLanguage('es');
        expect(i18n.t('nonexistent_key', { fallbackLng: 'en' })).toBe('nonexistent_key');
    });

    test('should escape values correctly', () => {
        i18n.changeLanguage('en');
        expect(i18n.t('welcome', { escapeValue: true })).toBe('Welcome to our service');
    });
});