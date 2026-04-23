import { useEffect, useState } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import cartBg from '../assets/images/Mycart_img.png';
import { cartService } from '../services/cart.service';

interface CartItemData {
    _id: string;
    course: {
        _id: string;
        title: string;
        level: string;
        price: number;
        image: string;
    };
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItemData[]>([]);
    const [couponCode, setCouponCode] = useState('');
    const [redeemPoints, setRedeemPoints] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cartService.get()
            .then(({ data }: any) => setCartItems(data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleRemoveItem = async (courseId: string) => {
        await cartService.remove(courseId);
        setCartItems(prev => prev.filter(item => item.course._id !== courseId));
    };

    const handleCheckout = async () => {
        try {
            const { data }: any = await cartService.checkout({ couponCode, redeemPoints });
            toast.success(`Checkout successful! Total paid: ₹${data.data.total}`);
            setCartItems([]);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Checkout failed');
        }
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.course.price, 0);

    if (loading) {
        return <div className="p-8 text-center text-gray-400">Loading cart…</div>;
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-6 pt-4">
                <div className="relative mb-16 rounded-xl bg-[#FFFFFF] h-48 flex items-center justify-center">
                    <div className="absolute inset-0 bg-cover bg-center rounded-xl" style={{ backgroundImage: "url('/images/cart-banner.png')" }} />
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg shadow-gray-200 z-50">
                        <ShoppingCart size={32} fill="#6366f1" color="#6366f1" />
                    </div>
                </div>

                {cartItems.length > 0 ? (
                    <div className="space-y-8 mt-16">
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                        <img src={item.course.image} alt={item.course.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 w-full text-center sm:text-left">
                                        <h3 className="font-bold text-slate-700 text-base mb-3 leading-tight max-w-sm">{item.course.title}</h3>
                                        <span className="bg-emerald-50 text-emerald-500 text-[11px] font-bold px-3 py-1.5 rounded-lg">{item.course.level}</span>
                                    </div>
                                    <div className="flex sm:flex-col items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 pl-0 sm:pl-6 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0">
                                        <span className="font-black text-indigo-600 text-2xl">₹ {item.course.price}</span>
                                        <button
                                            onClick={() => handleRemoveItem(item.course._id)}
                                            className="w-full sm:w-32 bg-white text-red-500 border border-red-500 font-bold py-2.5 rounded-xl hover:bg-red-50 flex items-center justify-center gap-2 text-sm"
                                        >
                                            <Trash2 size={16} /> Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="h-px bg-gray-200 w-full my-8" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Coupon</label>
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={e => setCouponCode(e.target.value)}
                                        placeholder="Enter Coupon Code"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Redeem Points</label>
                                    <input
                                        type="number"
                                        value={redeemPoints}
                                        onChange={e => setRedeemPoints(Number(e.target.value))}
                                        placeholder="Enter Points"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col items-end justify-center space-y-6">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-xl font-bold text-slate-700">Total</span>
                                    <span className="text-3xl font-black text-indigo-600">₹ {totalPrice}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="bg-[#2c2e33] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-black flex items-center gap-3 w-full sm:w-auto shadow-xl shadow-gray-200"
                                >
                                    Checkout Now
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center mt-12">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                            <ShoppingCart size={48} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">Your cart is empty</h3>
                        <p className="text-gray-400 mb-8 max-w-sm">Looks like you haven't added any courses to your cart yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}