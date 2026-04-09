1. Core Architecture
Atomic Design (Customized): Розділяти компоненти на atoms (кнопки, інпути), molecules (картка транзакції) та organisms (список транзакцій).

Feature-based Structure: Групувати файли за функціоналом (наприклад, features/auth, features/transactions), а не просто за типом файлу.

Hooks over Classes: Використовувати виключно функціональні компоненти та кастомні хуки для бізнес-логіки.

2. State Management & Data Fetching
TanStack Query (React Query): Обов’язково для серверного стейту (кешування, пагінація, мутації).

Використовувати useMutation з onSuccess для інвалідації запитів (авто-оновлення балансу після нової транзакції).

Zustand: Для легкого локального стейту (тема, вибір поточної валюти, фільтри).

Shared Types: Використовувати ідентичні інтерфейси з бекендом (або спільний пакет з типами).

3. Implementation Standards
Performance
FlatList Optimization: Використовувати memo, getItemLayout та keyExtractor для довгих списків транзакцій.

Image Optimization: Використовувати react-native-fast-image для іконок категорій.

Reanimated: Для анімацій (графіки, переходи) використовувати react-native-reanimated (UI thread execution).

UI & UX
Safe Area: Завжди використовувати useSafeAreaInsets або SafeAreaView для підтримки "брів" та нижніх панелей смартфонів.

Form Handling: Використовувати react-hook-form + zod для валідації (поля суми, дати, категорії).

Keyboard Handling: Обробляти перекриття інпутів клавіатурою за допомогою KeyboardAvoidingView.

4. API & Security
Axios Instance: Створити інстанс з базовим URL та перехоплювачами (Interceptors) для автоматичного додавання JWT токена в Authorization header.

Secure Storage: Зберігати токени лише через react-native-keychain або expo-secure-store. Ніколи не використовувати AsyncStorage для паролів чи токенів.

Error Boundary: Огортати додаток для відлову помилок рендерингу.

5. Styling
StyleSheet: Використовувати StyleSheet.create для оптимізації.

Theme Object: Всі кольори, відступи та шрифти мають братися з єдиного об'єкта theme.