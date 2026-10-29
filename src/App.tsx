/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useId } from 'react';
import {
  Lock,
  CheckCircle,
  Sparkles,
  ArrowDown,
  MessageCircle,
  Check,
  ShieldCheck,
  Gift,
  Heart,
  Search,
  PackageOpen,
  Palette,
  MapPin,
  LayoutDashboard,
  Eye,
  LogOut,
  Camera,
  X,
  PlusCircle,
  Edit3,
  Trash2,
  Sliders,
  Phone,
  KeyRound,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  status: 'Disponible' | 'Agotado';
  image: string;
  desc: string;
}

const STORAGE_KEY_PRODUCTS = 'nadiart_products_db';
const STORAGE_KEY_AUTH = 'nadiart_auth_credentials';
const STORAGE_KEY_CONFIG = 'nadiart_store_config';

/**
 * DATA SERVICE (PREPARACIÓN PARA INTEGRACIÓN CON FIREBASE)
 * Capa modular para desacoplar el almacenamiento y facilitar la conexión futura con Firebase.
 */
export const DataService = {
  // TODO: CONEXIÓN FIREBASE FIRESTORE
  // const querySnapshot = await getDocs(collection(db, "products"));
  // return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  async fetchProducts(): Promise<Product[]> {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  },

  // TODO: CONEXIÓN FIREBASE FIRESTORE
  // const docRef = await addDoc(collection(db, "products"), productData);
  // return { id: docRef.id, ...productData };
  async addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const newProduct: Product = { id: 'p_' + Date.now(), ...productData };
    const current = await this.fetchProducts();
    const updated = [newProduct, ...current];
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
    return newProduct;
  },

  // TODO: CONEXIÓN FIREBASE FIRESTORE
  // const ref = doc(db, "products", id);
  // await updateDoc(ref, updatedFields);
  async updateProduct(id: string, updatedFields: Partial<Product>): Promise<Product | null> {
    const current = await this.fetchProducts();
    const idx = current.findIndex((p) => p.id === id);
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...updatedFields };
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(current));
      return current[idx];
    }
    return null;
  },

  // TODO: CONEXIÓN FIREBASE FIRESTORE
  // await deleteDoc(doc(db, "products", id));
  async deleteProduct(id: string): Promise<boolean> {
    let current = await this.fetchProducts();
    current = current.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(current));
    return true;
  },

  // TODO: CONEXIÓN FIREBASE STORAGE
  // const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
  // const snapshot = await uploadBytes(storageRef, file);
  // return await getDownloadURL(snapshot.ref);
  async uploadProductImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (evt) => resolve((evt.target?.result as string) || '');
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Esferas & Adornos Navideños en Cerámica',
    price: 95,
    category: 'Navidad & Temporada',
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    desc: 'Adornos hechos a mano con relieves navideños finos (pinos, casitas y copos de nieve). Detalles esmaltados en dorado fino y turquesa invernal. Vienen con lazo para colgar.'
  },
  {
    id: 'p2',
    title: 'Adorno Estrella "Merry Christmas" en Relieve',
    price: 110,
    category: 'Navidad & Temporada',
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1512474932049-78ac69ede12c?auto=format&fit=crop&q=80&w=800',
    desc: 'Estrella en cerámica blanca con silueta de villa invernal y pinos en relieve. Acabado blanco mate con grabado artesanal de alta durabilidad.'
  },
  {
    id: 'p3',
    title: 'Copo de Nieve Glacial Cerámico',
    price: 90,
    category: 'Navidad & Temporada',
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&q=80&w=800',
    desc: 'Medallón circular con relieve profundo de copo de nieve resaltado en esmalte turquesa aguamarina. Una pieza fresca y luminosa para el árbol o un rincón especial.'
  },
  {
    id: 'p4',
    title: 'Servilletero Navideño Copo Dorado',
    price: 120,
    category: 'Navidad & Temporada',
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1576014131341-fe1486fb2475?auto=format&fit=crop&q=80&w=800',
    desc: 'Aro servilletero cerámico con flor/copo modelado a mano y baño dorado metalizado. Dale un toque de elegancia y calidez a tu mesa en las fiestas.'
  },
  {
    id: 'p5',
    title: 'Cuadro en Relieve Botánico Texturizado',
    price: 320,
    category: 'Cerámica & Relieve',
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
    desc: 'Pieza decorativa de pared con textura táctil en relieve de pasta cerámica y pigmentos minerales neutros. Hecho con espátula y amor creativo.'
  },
  {
    id: 'p6',
    title: 'Platillo Joyero con Sello de Gatito NadiArt',
    price: 140,
    category: 'Cerámica & Relieve',
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
    desc: 'Platito porta anillos y accesorios con el sello original del gatito grabado en la base y bordes irregulares orgánicos en tono oro viejo.'
  },
  {
    id: 'p7',
    title: 'Espejo Vintage Curado de Colección',
    price: 250,
    category: 'Bazar & Oportunidades',
    status: 'Agotado',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    desc: 'Pieza única de bazar en excelente estado estético. Marco labrado estilo clásico para decoración de recibidor o tocador.'
  }
];

export interface HeroSlide {
  id: string;
  image: string;
  badge: string;
  title: string;
  subtitle: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    badge: 'Colección Especial',
    title: 'Copos de Nieve & Oro Fino',
    subtitle: 'Relieves navideños esmaltados a mano con detalles brillantes',
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
    badge: 'Texturas & Relieve',
    title: 'Cuadros Botánicos Texturizados',
    subtitle: 'Pasta cerámica sobre lienzo con pigmentos minerales neutros',
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
    badge: 'Piezas de Autor',
    title: 'Platillos Joyeros Sello Gatito',
    subtitle: 'Bordes orgánicos irregulares con baño dorado al fuego',
  },
];

export default function App() {
  const onlyAvailableId = useId();

  // Carousel state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  // Auto carousel effect
  useEffect(() => {
    if (isCarouselPaused) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isCarouselPaused]);

  const nextHeroSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevHeroSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Data state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  const [authConfig, setAuthConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      return saved ? JSON.parse(saved) : { username: 'nadielope', password: 'pepelechuy' };
    } catch {
      return { username: 'nadielope', password: 'pepelechuy' };
    }
  });

  const [storeConfig, setStoreConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      return saved ? JSON.parse(saved) : { whatsappNumber: '5214620000000' };
    } catch {
      return { whatsappNumber: '5214620000000' };
    }
  });

  // UI state
  const [currentView, setCurrentView] = useState<'client' | 'admin'>('client');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Modal Detail
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formPrice, setFormPrice] = useState<number | ''>('');
  const [formCategory, setFormCategory] = useState('Navidad & Temporada');
  const [formStatus, setFormStatus] = useState<'Disponible' | 'Agotado'>('Disponible');
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState<string>('');
  const [formUrlInput, setFormUrlInput] = useState('');

  // Admin settings inputs
  const [adminSearch, setAdminSearch] = useState('');
  const [settingWhatsappInput, setSettingWhatsappInput] = useState(storeConfig.whatsappNumber);
  const [newUsernameInput, setNewUsernameInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authConfig));
    } catch (e) {
      console.error('Failed to save auth:', e);
    }
  }, [authConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(storeConfig));
    } catch (e) {
      console.error('Failed to save config:', e);
    }
  }, [storeConfig]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAdminNavClick = () => {
    if (isAdminLoggedIn) {
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsLoginModalOpen(true);
      setLoginError(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername.trim() === authConfig.username && loginPassword.trim() === authConfig.password) {
      setIsAdminLoggedIn(true);
      setIsLoginModalOpen(false);
      setCurrentView('admin');
      setLoginUsername('');
      setLoginPassword('');
      setLoginError(false);
      showToast('Sesión de administración iniciada');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView('client');
    showToast('Sesión de administración cerrada');
  };

  // Image upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const res = evt.target?.result as string;
      setFormImage(res);
      setFormUrlInput('');
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormTitle('');
    setFormPrice('');
    setFormCategory('Navidad & Temporada');
    setFormStatus('Disponible');
    setFormDesc('');
    setFormImage('');
    setFormUrlInput('');
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || formPrice === '') return;

    const finalImage = formImage || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800';

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                title: formTitle.trim(),
                price: Number(formPrice),
                category: formCategory,
                status: formStatus,
                desc: formDesc.trim(),
                image: finalImage,
              }
            : p
        )
      );
      showToast('Pieza actualizada exitosamente');
    } else {
      const newProduct: Product = {
        id: 'p_' + Date.now(),
        title: formTitle.trim(),
        price: Number(formPrice),
        category: formCategory,
        status: formStatus,
        desc: formDesc.trim(),
        image: finalImage,
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast('¡Nueva pieza publicada en tu catálogo!');
    }

    resetForm();
  };

  const startEditProduct = (prod: Product) => {
    setEditingId(prod.id);
    setFormTitle(prod.title);
    setFormPrice(prod.price);
    setFormCategory(prod.category);
    setFormStatus(prod.status);
    setFormDesc(prod.desc || '');
    setFormImage(prod.image);
    setFormUrlInput('');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const toggleProductStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStatus = p.status === 'Disponible' ? 'Agotado' : 'Disponible';
          showToast(`Estado cambiado a: ${newStatus}`);
          return { ...p, status: newStatus };
        }
        return p;
      })
    );
  };

  const handleInlinePriceChange = (id: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
    );
    showToast('Precio actualizado en línea');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) resetForm();
    showToast('Pieza eliminada del catálogo');
  };

  const saveWhatsappSettings = () => {
    const clean = settingWhatsappInput.replace(/[^0-9]/g, '');
    if (clean.length < 8) {
      showToast('Introduce un número válido con código de país (ej: 521...)');
      return;
    }
    setStoreConfig((prev: { whatsappNumber: string }) => ({ ...prev, whatsappNumber: clean }));
    showToast('Número de WhatsApp guardado para ventas');
  };

  const saveCredentialsSettings = () => {
    if (!newUsernameInput.trim() && !newPasswordInput.trim()) {
      showToast('Escribe un nuevo usuario o contraseña para actualizar');
      return;
    }
    setAuthConfig((prev: { username: string; password: string }) => ({
      username: newUsernameInput.trim() || prev.username,
      password: newPasswordInput.trim() || prev.password,
    }));
    setNewUsernameInput('');
    setNewPasswordInput('');
    showToast('Tus credenciales de acceso se han actualizado con éxito');
  };

  const contactGeneral = () => {
    const msg = encodeURIComponent('¡Hola NadiArt! Visité tu página web de catálogo y me gustaría pedirte información sobre tus piezas y pedidos.');
    window.open(`https://wa.me/${storeConfig.whatsappNumber}?text=${msg}`, '_blank');
  };

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (p.desc && p.desc.toLowerCase().includes(searchQuery.toLowerCase().trim()));
    const matchesAvailable = !onlyAvailable || p.status === 'Disponible';
    return matchesCategory && matchesSearch && matchesAvailable;
  });

  const adminFilteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(adminSearch.toLowerCase().trim()) ||
      p.category.toLowerCase().includes(adminSearch.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2D3134] selection:bg-gold-500 selection:text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-warmbeige transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setCurrentView('client');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group text-left cursor-pointer border-none bg-transparent"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold-500/50 bg-[#FAF8F5] flex items-center justify-center p-0.5 shadow-inner group-hover:scale-105 transition-transform duration-200 shrink-0">
              <img src="/nadia.png" alt="Logo NadiArt" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-serif text-2xl font-bold tracking-wider text-charcoal m-0 p-0 inline-flex items-center">
                  Nadi<span className="text-[#d4a373] font-medium">Art</span>
                </h1>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-glacier-700 bg-glacier-100/70 px-2 py-0.5 rounded-full border border-glacier-300">
                  Taller
                </span>
              </div>
              <p className="text-xs text-stone-500 font-light tracking-wide">Cerámica, relieve & tesoros artesanales</p>
            </div>
          </button>

          {/* Acciones de Navegación */}
          <div className="flex items-center gap-3">
            {currentView === 'client' && (
              <>
                <a
                  href="#contacto"
                  className="hidden sm:inline-flex text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-gold-600 px-3 py-2 transition-colors"
                >
                  Sobre Mí
                </a>
                <a
                  href="#catalogo"
                  className="hidden sm:inline-flex text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-gold-600 px-3 py-2 transition-colors"
                >
                  Catálogo
                </a>
              </>
            )}

            {currentView === 'admin' && (
              <button
                type="button"
                onClick={() => {
                  setCurrentView('client');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-stone-300 bg-white text-stone-700 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver Tienda</span>
              </button>
            )}

            {/* Botón Modo Administrador */}
            <button
              id="adminNavBtn"
              type="button"
              onClick={handleAdminNavClick}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-gold-500/60 bg-gold-50 text-gold-700 text-xs font-medium hover:bg-gold-500 hover:text-white transition-all duration-200 shadow-2xs cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'Mi Taller (Admin)' : 'Administrar'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* NOTIFICACIÓN TOAST */}
      <div
        className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 bg-charcoal text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-stone-600 pointer-events-none ${
          toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'
        }`}
      >
        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
        <span>{toastMessage}</span>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow">
        {currentView === 'client' ? (
          /* ==================== VISTA CLIENTE (CATÁLOGO) ==================== */
          <div>
            {/* HERO SECTION */}
            <section
              id="inicio"
              className="relative overflow-hidden bg-gradient-to-b from-linen via-warmbeige/30 to-transparent pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-warmbeige/60"
            >
              <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-glacier-100/60 blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-7 text-center lg:text-left space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-gold-500/40 shadow-xs">
                      <Sparkles className="w-4 h-4 text-gold-500" />
                      <span className="text-xs font-semibold text-stone-700 uppercase tracking-widest">
                        Edición Hecha a Mano & Temporada
                      </span>
                    </div>

                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal font-bold leading-tight">
                      Detalles únicos que cuentan una{' '}
                      <span className="italic font-normal text-gold-600">historia</span>
                    </h1>

                    <p className="text-stone-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                      Cerámica blanca, texturas en relieve invernales con destellos dorados y turquesa. Cada pieza es modelada
                      con calma y amor para llenar de luz y arte tu hogar.
                    </p>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                      <a
                        href="#catalogo"
                        className="px-6 py-3.5 rounded-full bg-charcoal text-white hover:bg-stone-800 text-sm font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <span>Ver Piezas Disponibles</span>
                        <ArrowDown className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        onClick={contactGeneral}
                        className="px-6 py-3.5 rounded-full bg-white text-stone-800 border border-stone-300 hover:border-gold-500 hover:bg-gold-50/50 text-sm font-semibold tracking-wide transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>Pregúntame por WhatsApp</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-stone-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-gold-500" />
                        <span>100% Artesanal</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-gold-500" />
                        <span>Sello de Autor</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-gold-500" />
                        <span>Listo para regalar</span>
                      </div>
                    </div>
                  </div>

                  {/* Carrusel Automático de Obras de Cerámica Destacadas */}
                  <div className="lg:col-span-5 relative">
                    <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
                      <div
                        className="group/carousel relative bg-white p-3 rounded-3xl shadow-xl border border-warmbeige transform -rotate-1 hover:rotate-0 transition-all duration-300"
                        onMouseEnter={() => setIsCarouselPaused(true)}
                        onMouseLeave={() => setIsCarouselPaused(false)}
                      >
                        {/* Contenedor de Diapositivas con Relación de Aspecto */}
                        <div className="aspect-4/3 rounded-2xl overflow-hidden bg-warmbeige/40 relative select-none">
                          {HERO_SLIDES.map((slide, idx) => {
                            const isActive = idx === currentSlideIndex;
                            return (
                              <div
                                key={slide.id}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                                }`}
                              >
                                <img
                                  src={slide.image}
                                  alt={slide.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent flex items-end p-5">
                                  <div className="text-white space-y-1">
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-glacier-300 bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                                      {slide.badge}
                                    </span>
                                    <h4 className="font-serif text-xl sm:text-2xl font-bold mt-1 text-white leading-tight">
                                      {slide.title}
                                    </h4>
                                    <p className="text-xs text-stone-200 font-light opacity-90 line-clamp-1">
                                      {slide.subtitle}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* Botón Flecha Izquierda */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              prevHeroSlide();
                            }}
                            aria-label="Anterior pieza"
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer shadow-md border border-white/20"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          {/* Botón Flecha Derecha */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              nextHeroSlide();
                            }}
                            aria-label="Siguiente pieza"
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer shadow-md border border-white/20"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          {/* Indicadores Píldora / Puntos */}
                          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs border border-white/10">
                            {HERO_SLIDES.map((_, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentSlideIndex(idx);
                                }}
                                aria-label={`Ir a pieza ${idx + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                  idx === currentSlideIndex
                                    ? 'w-5 bg-gold-400 shadow-xs'
                                    : 'w-1.5 bg-white/50 hover:bg-white/90'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Pie del marco Polaroid artesanal */}
                        <div className="p-3 flex items-center justify-between text-xs text-stone-600">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Cerámica NadiArt
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-stone-400 font-medium tracking-wider">
                              {currentSlideIndex + 1} / {HERO_SLIDES.length}
                            </span>
                            <span className="font-semibold text-gold-600">Taller Exclusivo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECCIÓN CATÁLOGO */}
            <section id="catalogo" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
                <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-bold">Catálogo de Piezas</h2>
                <div className="w-16 h-0.5 bg-gold-500 mx-auto" />
                <p className="text-stone-600 text-sm sm:text-base">
                  Explora las creaciones disponibles. Si te enamoras de una pieza, presiona el botón para acordar entrega o
                  apartarla al instante.
                </p>
              </div>

              {/* Filtros y Búsqueda */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-warmbeige shadow-xs">
                {/* Categorías */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('all')}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      categoryFilter === 'all'
                        ? 'bg-charcoal text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('Navidad & Temporada')}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      categoryFilter === 'Navidad & Temporada'
                        ? 'bg-charcoal text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    🎄 Navidad & Temporada
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('Cerámica & Relieve')}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      categoryFilter === 'Cerámica & Relieve'
                        ? 'bg-charcoal text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    🏺 Cerámica & Relieve
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('Bazar & Oportunidades')}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      categoryFilter === 'Bazar & Oportunidades'
                        ? 'bg-charcoal text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    ✨ Bazar & Oportunidades
                  </button>
                </div>

                {/* Buscador y Checkbox */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-grow sm:w-60">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por nombre..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-gold-500 transition-all"
                    />
                  </div>

                  <label 
                    htmlFor={onlyAvailableId}
                    className="flex items-center gap-2 cursor-pointer select-none text-xs text-stone-600 shrink-0 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-100 transition-colors"
                  >
                    <input
                      id={onlyAvailableId}
                      type="checkbox"
                      checked={onlyAvailable}
                      onChange={(e) => setOnlyAvailable(e.target.checked)}
                      className="rounded text-gold-600 focus:ring-gold-500 h-3.5 w-3.5 border-stone-300"
                    />
                    <span>Solo disponibles</span>
                  </label>
                </div>
              </div>

              {/* GRID DE PRODUCTOS */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((prod, index) => {
                    const isAvailable = prod.status === 'Disponible';
                    const whatsappMsg = encodeURIComponent(
                      `¡Hola NadiArt! Me encantó la pieza "${prod.title}" de $${prod.price} MXN que vi en tu catálogo. ¿Sigue disponible para entrega?`
                    );
                    const whatsappLink = `https://wa.me/${storeConfig.whatsappNumber}?text=${whatsappMsg}`;

                    return (
                      <div
                        key={`${categoryFilter}_${searchQuery}_${onlyAvailable}_${prod.id}`}
                        style={{ animationDelay: `${Math.min(index * 45, 360)}ms` }}
                        className="bg-white rounded-3xl overflow-hidden border border-warmbeige shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group animate-card-enter"
                      >
                        <div
                          className="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer"
                          onClick={() => setSelectedProduct(prod)}
                        >
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          <div className="absolute top-3 left-3">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs shadow-xs ${
                                isAvailable ? 'bg-emerald-600/90 text-white' : 'bg-stone-700/85 text-stone-200'
                              }`}
                            >
                              {prod.status}
                            </span>
                          </div>

                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-8 h-8 rounded-full bg-white/90 text-stone-800 flex items-center justify-center shadow-md">
                              <ZoomIn className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                          <div className="space-y-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gold-600">
                              {prod.category}
                            </span>
                            <h3
                              onClick={() => setSelectedProduct(prod)}
                              className="font-serif text-base font-bold text-charcoal line-clamp-1 cursor-pointer hover:text-gold-600 transition"
                            >
                              {prod.title}
                            </h3>
                            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                              {prod.desc || 'Pieza artesanal única hecha a mano.'}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] text-stone-400 block uppercase font-medium">Precio</span>
                              <span className="font-serif text-lg font-bold text-charcoal">
                                ${prod.price}{' '}
                                <span className="text-xs font-sans font-normal text-stone-500">MXN</span>
                              </span>
                            </div>

                            {isAvailable ? (
                              <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold tracking-wide transition flex items-center gap-1.5 shadow-2xs"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Pedir</span>
                              </a>
                            ) : (
                              <button
                                disabled
                                className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-400 text-xs font-semibold cursor-not-allowed"
                              >
                                Agotado
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Estado vacío */
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-200 p-8">
                  <div className="w-16 h-16 rounded-full bg-gold-50 mx-auto flex items-center justify-center text-gold-500 mb-4">
                    <PackageOpen className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-charcoal">No encontramos piezas con ese filtro</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                    Prueba cambiando la búsqueda o seleccionando otra categoría para descubrir más creaciones.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setOnlyAvailable(false);
                      setCategoryFilter('all');
                    }}
                    className="mt-4 px-4 py-2 rounded-full bg-charcoal text-white text-xs font-semibold hover:bg-stone-800 transition cursor-pointer"
                  >
                    Ver todo el catálogo
                  </button>
                </div>
              )}
            </section>

            {/* SECCIÓN SOBRE LA ARTESANA */}
            <section id="contacto" className="bg-linen py-16 border-t border-warmbeige">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-warmbeige shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-5 text-center">
                    <div className="relative inline-block">
                      <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-gold-400/40 p-1 bg-white shadow-md mx-auto">
                        <img src="/nadia.png" alt="Logo NadiArt" className="w-full h-full object-cover rounded-full" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-charcoal text-white text-[11px] px-3 py-1 rounded-full font-semibold border-2 border-white shadow-sm flex items-center gap-1">
                        <span>🎨 Arte & Amor</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-4 text-stone-700">
                    <span className="text-xs font-bold tracking-widest uppercase text-gold-600">El alma del taller</span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-charcoal font-bold">
                      Creando con las manos y el corazón
                    </h3>
                    <p className="text-sm leading-relaxed text-stone-600">
                      <em>
                        "Ahorita que tengo un poco más de tiempo, he decidido compartir mis piezas. Hago cerámica, cuadros
                        con relieve y aprovecho para sacar todo mi lado creativo."
                      </em>
                    </p>
                    <p className="text-xs leading-relaxed text-stone-500">
                      Cada estrella, copo, esfera y plato lleva un proceso cuidadoso de modelado, secado, esmaltado y
                      pintado fino con acabados dorados y esmaltes cristalinos. Además, encontrarás artículos curados y
                      oportunidades en excelente estado.
                    </p>

                    <div className="pt-2 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={contactGeneral}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Enviar mensaje por WhatsApp</span>
                      </button>
                      <div className="inline-flex items-center gap-1 text-xs text-stone-500 font-medium px-3 py-2 bg-stone-50 rounded-full border border-stone-200">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>Entregas locales y envíos a convenir</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* ==================== VISTA PANEL ADMINISTRADOR ==================== */
          <div className="min-h-[calc(100vh-80px)] bg-stone-100/70 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Barra de Cabecera del Admin */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-600 flex items-center justify-center font-bold text-xl border border-gold-500/20">
                    <LayoutDashboard className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-charcoal">Panel de Control NadiArt</h2>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md uppercase">
                        Sesión Activa
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">Gestión de piezas, precios, fotos y configuración de pedidos.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('client');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver Tienda Pública</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>

              {/* Métricas Rápidas */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                  <span className="text-xs text-stone-500 font-medium">Total Productos</span>
                  <p className="text-2xl font-bold text-charcoal mt-1">{products.length}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                  <span className="text-xs text-stone-500 font-medium">Disponibles</span>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">
                    {products.filter((p) => p.status === 'Disponible').length}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                  <span className="text-xs text-stone-500 font-medium">Agotados / Vendidos</span>
                  <p className="text-2xl font-bold text-amber-600 mt-1">
                    {products.filter((p) => p.status === 'Agotado').length}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                  <span className="text-xs text-stone-500 font-medium">WhatsApp de Pedidos</span>
                  <p className="text-xs font-semibold text-stone-800 mt-2 truncate">+{storeConfig.whatsappNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* FORMULARIO CREAR / EDITAR PRODUCTO (5 Cols) */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
                  <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-charcoal">
                        {editingId ? 'Editar Pieza' : 'Publicar Nueva Pieza'}
                      </h3>
                      <p className="text-xs text-stone-500">Sube fotos tomadas con tu celular y fija su precio</p>
                    </div>
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-xs text-rose-600 font-medium hover:underline cursor-pointer"
                      >
                        Cancelar edición
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    {/* Nombre del producto */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Nombre o Título de la Pieza *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Ej: Esfera Copo de Nieve Cerámica"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-stone-50/40"
                      />
                    </div>

                    {/* Precio y Categoría */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Precio ($ MXN) *</label>
                        <input
                          type="number"
                          required
                          step="1"
                          min="0"
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="150"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-stone-50/40"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Categoría *</label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-gold-500 bg-stone-50/40"
                        >
                          <option value="Navidad & Temporada">Navidad & Temporada</option>
                          <option value="Cerámica & Relieve">Cerámica & Relieve</option>
                          <option value="Bazar & Oportunidades">Bazar & Oportunidades</option>
                        </select>
                      </div>
                    </div>

                    {/* Estado de Inventario */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Estado de Inventario</label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as 'Disponible' | 'Agotado')}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-gold-500 bg-stone-50/40"
                      >
                        <option value="Disponible">🟢 Disponible para entrega</option>
                        <option value="Agotado">🔴 Agotado / Pieza Vendida</option>
                      </select>
                    </div>

                    {/* Carga de Foto */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Foto de la pieza *</label>

                      <div className="space-y-2">
                        {/* Botón subida de archivo */}
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-stone-300 rounded-2xl p-4 cursor-pointer hover:bg-stone-50 hover:border-gold-400 transition-colors text-center">
                          <Camera className="w-6 h-6 text-gold-600 mb-1" />
                          <span className="text-xs font-medium text-stone-700">Subir foto desde tu dispositivo</span>
                          <span className="text-[10px] text-stone-400">JPG, PNG o foto tomada con el celular</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                        </label>

                        {/* O pegar URL */}
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="O pega un enlace de imagen (URL)..."
                            value={formUrlInput}
                            onChange={(e) => {
                              setFormUrlInput(e.target.value);
                              if (e.target.value.trim()) {
                                setFormImage(e.target.value.trim());
                              }
                            }}
                            className="w-full text-[11px] px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-gold-500 bg-stone-50/30"
                          />
                        </div>
                      </div>

                      {/* Preview de la foto */}
                      {formImage && (
                        <div className="mt-3 relative aspect-video rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                          <img src={formImage} alt="Previsualización" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setFormImage('');
                              setFormUrlInput('');
                            }}
                            className="absolute top-2 right-2 bg-charcoal/80 text-white p-1 rounded-full text-xs hover:bg-rose-600 transition cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Descripción */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Descripción corta o medidas
                      </label>
                      <textarea
                        rows={3}
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        placeholder="Ej: Cerámica con textura de pino nevado en dorado y relieve. Medida: 8cm de diámetro."
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-stone-50/40"
                      />
                    </div>

                    {/* Botón Guardar */}
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gold-600 hover:bg-gold-700 text-white font-semibold text-xs tracking-wider uppercase transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{editingId ? 'Guardar Cambios' : 'Publicar Pieza'}</span>
                    </button>
                  </form>
                </div>

                {/* LISTA Y GESTIÓN DE PRODUCTOS (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-charcoal">Inventario Actual</h3>
                        <p className="text-xs text-stone-500">Haz clic en modificar o cambia el precio al instante</p>
                      </div>
                      <div className="relative w-full sm:w-48">
                        <input
                          type="text"
                          value={adminSearch}
                          onChange={(e) => setAdminSearch(e.target.value)}
                          placeholder="Filtrar lista..."
                          className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50"
                        />
                        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Tabla de productos */}
                    <div className="overflow-x-auto custom-scroll max-h-[580px]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-50 text-stone-600 font-semibold sticky top-0 border-b border-stone-200">
                          <tr>
                            <th className="py-2.5 px-3">Pieza</th>
                            <th className="py-2.5 px-2">Categoría</th>
                            <th className="py-2.5 px-2">Precio</th>
                            <th className="py-2.5 px-2">Estado</th>
                            <th className="py-2.5 px-3 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-stone-700">
                          {adminFilteredProducts.map((prod) => (
                            <tr key={prod.id} className="hover:bg-stone-50/70 transition">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={prod.image}
                                    alt=""
                                    className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                                  />
                                  <div className="font-medium text-stone-800 line-clamp-1">{prod.title}</div>
                                </div>
                              </td>
                              <td className="py-3 px-2 text-stone-500 whitespace-nowrap">{prod.category}</td>
                              <td className="py-3 px-2 whitespace-nowrap">
                                <div className="flex items-center gap-1 font-bold text-stone-800">
                                  <span>$</span>
                                  <input
                                    type="number"
                                    defaultValue={prod.price}
                                    min="0"
                                    step="1"
                                    onBlur={(e) => {
                                      const val = Number(e.target.value);
                                      if (!isNaN(val) && val >= 0 && val !== prod.price) {
                                        handleInlinePriceChange(prod.id, val);
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        (e.target as HTMLInputElement).blur();
                                      }
                                    }}
                                    className="w-20 px-2 py-1 text-xs border border-stone-200 rounded-lg bg-stone-50/70 focus:bg-white focus:outline-none focus:border-gold-400 font-bold"
                                  />
                                </div>
                              </td>
                              <td className="py-3 px-2 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => toggleProductStatus(prod.id)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide transition cursor-pointer ${
                                    prod.status === 'Disponible'
                                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                  }`}
                                >
                                  {prod.status}
                                </button>
                              </td>
                              <td className="py-3 px-3 text-right whitespace-nowrap space-x-1">
                                <button
                                  type="button"
                                  onClick={() => startEditProduct(prod)}
                                  title="Editar"
                                  className="p-1.5 rounded-lg text-stone-600 hover:text-gold-600 hover:bg-gold-50 transition cursor-pointer"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteProduct(prod.id)}
                                  title="Eliminar"
                                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* AJUSTES DE TIENDA Y CUENTA */}
                  <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
                    <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                      <Sliders className="w-5 h-5 text-gold-600" />
                      <h3 className="font-serif text-base font-bold text-charcoal">
                        Configuración de Tienda & Acceso
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Ajuste Teléfono WhatsApp */}
                      <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald-600" />
                          <h4 className="text-xs font-bold text-stone-800">Número de WhatsApp de Venta</h4>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Aquí te llegarán los mensajes automáticos de los clientes listos para comprar.
                        </p>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={settingWhatsappInput}
                            onChange={(e) => setSettingWhatsappInput(e.target.value)}
                            placeholder="Ej: 5214621234567"
                            className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white"
                          />
                          <button
                            type="button"
                            onClick={saveWhatsappSettings}
                            className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer"
                          >
                            Guardar Teléfono
                          </button>
                        </div>
                      </div>

                      {/* Cambio de Contraseña y Usuario */}
                      <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                        <div className="flex items-center gap-2">
                          <KeyRound className="w-4 h-4 text-gold-600" />
                          <h4 className="text-xs font-bold text-stone-800">Cambiar Contraseña y Acceso</h4>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Actualiza tus credenciales para mantener tu panel protegido de forma privada.
                        </p>

                        <div className="space-y-2">
                          <input
                            type="text"
                            value={newUsernameInput}
                            onChange={(e) => setNewUsernameInput(e.target.value)}
                            placeholder="Nuevo Nombre de Usuario"
                            className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white"
                          />
                          <input
                            type="password"
                            value={newPasswordInput}
                            onChange={(e) => setNewPasswordInput(e.target.value)}
                            placeholder="Nueva Contraseña"
                            className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white"
                          />
                          <button
                            type="button"
                            onClick={saveCredentialsSettings}
                            className="w-full py-2 rounded-xl bg-charcoal hover:bg-stone-800 text-white text-xs font-semibold transition cursor-pointer"
                          >
                            Actualizar Credenciales
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL LOGIN ADMINISTRADOR */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-warmbeige shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200 text-gold-600 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal">Acceso a Taller</h3>
              <p className="text-xs text-stone-500">Ingresa tus credenciales para administrar tus piezas</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Usuario</label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-gold-500 bg-stone-50/50"
                  placeholder="Ingresa tu usuario"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-gold-500 bg-stone-50/50"
                  placeholder="••••••••"
                />
              </div>

              {loginError && (
                <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center font-medium">
                  Usuario o contraseña incorrectos
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-charcoal hover:bg-stone-800 text-white font-semibold text-xs tracking-wider uppercase transition shadow-md cursor-pointer"
              >
                Entrar al Panel
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-[11px] text-stone-400">Acceso exclusivo de administración</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE PRODUCTO (CLIENTES) */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full border border-warmbeige shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-xs text-stone-700 hover:text-stone-900 p-2 rounded-full shadow-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-square bg-stone-100 overflow-hidden relative">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute bottom-3 left-3 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${
                    selectedProduct.status === 'Disponible'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-700 text-stone-200'
                  }`}
                >
                  {selectedProduct.status}
                </span>
              </div>

              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-[11px] uppercase tracking-widest font-semibold text-gold-600">
                    {selectedProduct.category}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-charcoal">{selectedProduct.title}</h3>
                  <p className="text-2xl font-bold text-gold-600">${selectedProduct.price} MXN</p>
                  <div className="w-12 h-0.5 bg-stone-200" />
                  <p className="text-xs leading-relaxed text-stone-600">
                    {selectedProduct.desc || 'Pieza hecha con relieve y cerámica artesanal.'}
                  </p>
                </div>

                <div className="pt-4 space-y-2">
                  {selectedProduct.status === 'Disponible' ? (
                    <button
                      type="button"
                      onClick={() => {
                        const msg = encodeURIComponent(
                          `Hola NadiArt! Quisiera comprar la pieza "${selectedProduct.title}" que vi en el catálogo por $${selectedProduct.price} MXN.`
                        );
                        window.open(`https://wa.me/${storeConfig.whatsappNumber}?text=${msg}`, '_blank');
                      }}
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Lo quiero / Pedir por WhatsApp</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3.5 rounded-2xl bg-stone-200 text-stone-500 font-semibold text-xs uppercase tracking-wider opacity-60 cursor-not-allowed text-center"
                    >
                      Esta pieza ya fue vendida
                    </button>
                  )}
                  <p className="text-[10px] text-center text-stone-400">
                    Acuerda pago, envío o entrega personal directamente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-warmbeige py-10 mt-auto text-stone-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-charcoal text-base">
              Nadi<span className="text-gold-600">Art</span>
            </span>
            <span className="text-stone-400">|</span>
            <span className="text-stone-500">Hecho a mano con creatividad y detalle</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <p>© 2026 NadiArt. Todos los derechos reservados.</p>
            <button
              type="button"
              onClick={handleAdminNavClick}
              className="text-stone-400 hover:text-gold-600 underline text-[11px] transition cursor-pointer"
            >
              Acceso Administración
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
