import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Image,
  TouchableOpacity,
  Button,
  ScrollView,
  Dimensions,
  TextInput,
  ToastAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../../constants/Colors';
import {products} from '../../../constants/products'; // Assuming products data is in a separate file
import axios from 'axios';
import {Server} from '../../../constants/Configs';
import {UserContext} from '../../../context/UserContext';

const {width} = Dimensions.get('window');

const Marketplace = () => {
  const {user} = useContext(UserContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isCartModalVisible, setCartModalVisible] = useState(false);
  const [isDeliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const handleAddToCart = () => {
    const productExists = cart.find(item => item.id === selectedProduct.id);
    if (productExists) {
      setCart(
        cart.map(item =>
          item.id === selectedProduct.id
            ? {...item, quantity: item.quantity + quantity}
            : item,
        ),
      );
    } else {
      setCart([...cart, {...selectedProduct, quantity}]);
    }
    setQuantity(1);
    setSelectedProduct(null); // Close the modal by setting selectedProduct to null
  };

  const handleCheckout = () => {
    setCartModalVisible(false); // Close the cart modal
    setDeliveryModalVisible(true); // Open the delivery details modal
  };

  const confirmCheckout = () => {
    const checkoutDetails = {
      cart,
      delivery: {
        recipientName,
        deliveryAddress,
      },
    };
    console.log('Checkout Details:', checkoutDetails);
    axios
      .post(`${Server}/api/market-place/checkout`, {
        ...checkoutDetails,
        email: user.email,
      })
      .then(res => {
        if (res.status === 200) {
          ToastAndroid.show('Order placed successfully!', ToastAndroid.SHORT);
          setCart([]);
          setRecipientName('');
          setDeliveryAddress('');
          setDeliveryModalVisible(false);
        }
      })
      .catch(err => {
        console.error(err.message);
      });
    // Reset cart and input fields after checkout
  };

  const getTotalAmount = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const deleteCartItem = id => {
    setCart(cart.filter(item => item.id !== id));
  };

  const resetCart = () => {
    setCart([]);
  };

  const renderProductImages = ({item}) => (
    <Image source={{uri: item}} style={styles.productDetailImage} />
  );

  const renderCartItem = ({item}) => (
    <View style={styles.cartItem}>
      <TouchableOpacity
        style={styles.cartItemInfo}
        onPress={() => setSelectedProduct(item)}>
        <Image
          source={{uri: item.images[0]}}
          style={[
            styles.cartItemImage,
            {height: 80, width: 80, padding: 1, margin: 0},
          ]}
        />
        <View style={styles.cartItemDetails}>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text
            style={{
              fontSize: 15,
              color: Colors.Secondary,
              backgroundColor: Colors.Blue,
              maxWidth: 90,
              padding: 3,
              borderRadius: 14,
              textAlign: 'center',
            }}>
            ${item.price.toFixed(2)} x {item.quantity}
          </Text>
          <Text style={{color: Colors.Secondary}}>
            Subtotal: ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteCartItem(item.id)}
        style={styles.deleteIcon}>
        <Ionicons name="trash-can-outline" size={24} color={Colors.Error} />
      </TouchableOpacity>
    </View>
  );

  // Calculate the total number of items in the cart
  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <TouchableOpacity onPress={() => setCartModalVisible(true)}>
          <Ionicons name="cart-outline" size={32} color={Colors.Blue} />
          {getCartItemCount() > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getCartItemCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.card}
            onPress={() => setSelectedProduct(item)}>
            <Image source={{uri: item.images[0]}} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              <Text style={styles.productDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.productList}
        style={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
      />

      {/* Product Details Modal */}
      {selectedProduct && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={!!selectedProduct}
          onRequestClose={() => setSelectedProduct(null)}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedProduct(null)}>
              <Ionicons name="arrow-left" size={20} color={Colors.Secondary} />
            </TouchableOpacity>
            <ScrollView>
              {/* Image Carousel */}
              <FlatList
                data={selectedProduct.images}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderProductImages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
              />

              <View style={styles.productDetails}>
                <Text style={styles.modalTitle}>{selectedProduct.title}</Text>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      setQuantity(quantity > 1 ? quantity - 1 : 1)
                    }>
                    <Ionicons
                      name="minus-circle-outline"
                      size={24}
                      color={Colors.TintColorLight}
                    />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                    <Ionicons
                      name="plus-circle-outline"
                      size={24}
                      color={Colors.TintColorLight}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.productPrice}>
                  ${selectedProduct.price.toFixed(2)}
                </Text>
                <Text style={styles.sectionTitle}>Description:</Text>
                <Text style={styles.productDescription}>
                  {selectedProduct.description}
                </Text>
                <Text style={styles.sectionTitle}>Ingredients:</Text>
                <Text style={styles.productDescription}>
                  {selectedProduct.ingredients}
                </Text>

                <Text style={styles.sectionTitle}>Pros:</Text>
                {selectedProduct.pros.map((pro, index) => (
                  <Text key={index} style={styles.productDescription}>
                    - {pro}
                  </Text>
                ))}

                <Text style={styles.sectionTitle}>Side Effects:</Text>
                {selectedProduct.sideEffects.map((effect, index) => (
                  <Text key={index} style={styles.productDescription}>
                    - {effect}
                  </Text>
                ))}
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.Blue,
                    padding: 15,
                    borderRadius: 20,
                    marginVertical: 20,
                  }}
                  onPress={handleAddToCart}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: Colors.Secondary,
                      fontWeight: 'bold',
                    }}>
                    Add to Cart
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}

      {/* Cart Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isCartModalVisible}
        onRequestClose={() => setCartModalVisible(false)}>
        <View style={styles.cartModalContent}>
          <TouchableOpacity
            style={[styles.closeButton, {right: '3%', left: '98%', top: 18}]}
            onPress={() => setCartModalVisible(false)}>
            <Ionicons name="close" size={18} color={Colors.Secondary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Your Cart</Text>
          <FlatList
            data={cart}
            keyExtractor={item => item.id.toString()}
            renderItem={renderCartItem}
            contentContainerStyle={styles.cartList}
          />
          <View style={styles.cartTotal}>
            <Text style={styles.totalText}>Total: ${getTotalAmount()}</Text>
          </View>
          <View style={styles.cartButtonsContainer}>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={handleCheckout}>
              <Text style={styles.buttonText}>Checkout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cartButton, styles.resetButton]}
              onPress={resetCart}>
              <Text style={styles.buttonText}>Reset Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delivery Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeliveryModalVisible}
        onRequestClose={() => setDeliveryModalVisible(false)}>
        <View style={styles.deliveryModalContent}>
          <View style={styles.deliveryModal}>
            <Text style={styles.modalTitle}>Delivery Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Recipient Name"
              placeholderTextColor={Colors.TextSecondary}
              value={recipientName}
              onChangeText={setRecipientName}
            />
            <TextInput
              style={styles.input}
              placeholder="Delivery Address"
              placeholderTextColor={Colors.TextSecondary}
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              multiline={true}
              numberOfLines={2}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  {
                    position: 'static',
                    top: 0,
                    left: 0,
                    flexGrow: 1,
                    backgroundColor: Colors.Success,
                    marginHorizontal: 10,
                  },
                ]}
                onPress={confirmCheckout}>
                <Text style={{color: Colors.Secondary, textAlign: 'center'}}>
                  {' '}
                  <Ionicons name="truck-check-outline" size={14} /> Confirm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  {position: 'static', top: 0, left: 0, flexGrow: 1},
                ]}
                onPress={() => setDeliveryModalVisible(false)}>
                <Text style={{color: Colors.Secondary, textAlign: 'center'}}>
                  {' '}
                  X Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  title: {
    color: Colors.TextPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  productList: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.CardBackground,
    borderColor: Colors.CardBorder,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
  },
  productImage: {
    width: 120,
    height: 120,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productTitle: {
    color: Colors.TextPrimary,
    fontSize: 18,
    marginBottom: 5,
  },
  productPrice: {
    backgroundColor: Colors.Blue,
    color: Colors.Secondary,
    fontSize: 16,
    maxWidth: 70,
    padding: 5,
    borderRadius: 30,
    textAlign: 'center',
  },
  productDescription: {
    color: Colors.TextSecondary,
    fontSize: 14,
    marginBottom: 5,
  },
  modalContent: {
    flex: 1,
    backgroundColor: Colors.Primary,
    position: 'relative', // Ensure relative positioning for child absolute elements
  },
  productDetailImage: {
    width: width,
    height: 300,
  },
  productDetails: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    color: Colors.TextPrimary,
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityText: {
    color: Colors.TextPrimary,
    fontSize: 18,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.TextPrimary,
    marginTop: 10,
  },
  cartModalContent: {
    flex: 1,
    backgroundColor: Colors.Primary,
    padding: 20,
  },
  cartList: {
    paddingVertical: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.CardBackground,
    borderColor: Colors.CardBorder,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  cartItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Ensures cart item info takes up remaining space
  },
  cartItemImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  cartItemDetails: {
    flex: 1,
  },
  deleteIcon: {
    marginLeft: 10,
  },
  cartTotal: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    color: Colors.TextPrimary,
    fontWeight: 'bold',
  },
  cartButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cartButton: {
    flex: 0.48,
    backgroundColor: Colors.Blue,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: Colors.Error,
  },
  buttonText: {
    color: Colors.Secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deliveryModalContent: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  deliveryModal: {
    backgroundColor: Colors.Primary,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative', // Ensure relative positioning for child absolute elements
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: Colors.CardBorder,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: Colors.CardBackground,
    color: Colors.TextPrimary,
    marginBottom: 10,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.Error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.Secondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: Colors.Error,
    borderRadius: 50,
    padding: 10,
    zIndex: 1, // Ensure the button is on top
  },
});

export default Marketplace;
