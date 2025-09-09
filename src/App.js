import { useEffect, useState } from "react";

// Todo listesi oluşturacağız ve API'den alınan verileri görüntüleyeceğiz.
// Görevler:
// 1. useEffect hook'u kullanarak `https://jsonplaceholder.typicode.com/users/1/todos` API'sinden verileri alın ve bu verileri state içinde saklayın.
// 2. Alınan verileri Todo bileşenine props olarak aktararak her bir todo öğesini liste halinde görüntüleyin.
// 3. Her todo için şu bilgileri gösterin:
//    - Başlık (title)
//    - Tamamlanma durumu (completed, checkbox olarak gösterilmeli)
// 4. Checkbox işaretlendiğinde veya kaldırıldığında, o todo'nun tamamlanma durumunu state'de güncelleyin (UI'da hemen güncellenmeli).

// Bonus:
// - "Yapılacaklar Listem" başlığının altına, toplam todo sayısını ve tamamlanmış olan todo sayısını gösterin (örneğin "Toplam: 10, Tamamlanmış: 3").
// - Todo listesini alfabetik sıraya veya tamamlanma durumuna göre sıralamak için dropdown ekleyin.
// - Kullanıcı listeye yeni bir todo ekleyebilsin. Yeni eklenen todo, otomatik olarak "tamamlanmamış" durumunda ve geçici ID ile eklenmelidir.
// - API'den veri alınırken yükleniyor durumu (Loading...) ve hata durumu (Hata oluştu.) ekleyin.

// Tailwind ile ilgili istekler:
// 1. Todo öğeleri için daha belirgin kart tasarımı oluşturun (örneğin shadow, border ve rounded-md class'larını kullanarak).
// 2. Tamamlanmış todo öğelerinin başlıklarına vurgu ekleyin (örneğin line-through ve text-gray-500).
// 3. "Yapılacaklar Listem" başlığını ve sayaçları farklı arka plan ve yazı stiliyle vurgulayın.
// 4. Checkbox hover edildiğinde, kutunun kenar rengini değiştiren animasyon ekleyin.
// 5. Mobil cihazlar için listeyi daha kompakt düzene göre optimize edin (örneğin, küçük yazı tipi boyutları ve dar kenar boşlukları).

export default function Todos() {
  //   {
  //     "userId": 1,
  //     "id": 1,
  //     "title": "delectus aut autem",
  //     "completed": false
  // }[]
  const [todos, setTodos] = useState([]);
  const [countCompleted, setCountCompleted] = useState(0);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);

  useEffect(() => {
    const count = todos.reduce((prev, value) => {
      return value.completed ? prev + 1 : prev;
    }, 0);
    setCountCompleted(count);
  }, [todos]);

  const handleComplated = (id) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }

      return todo;
    });
    
    setTodos(newTodos);
  };
  useEffect(() => {
    const query = async () => {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/1/todos`
        );
        if (!response.ok) throw new Error("Serverda hata var");

        const data = await response.json();
        console.log(data);
        if (data) {
          data.sort((a,b) => a.title.localeCompare(b.title));
          setTodos([...data]);
        } else {
          throw new Error("Görevlere ulaşılamadı");
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError(err.message);
        setLoading(false);
      }
    };
    query();
  }, []);

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 p-6 font-bold">{error}</div>;
  }
  return (
    <div className="flex justify-center flex-col items-center py-8">
      <h1 className="text-2xl font-bold pb-4 text-indigo-600">
        Yapılacaklar Listem <br /> 
      </h1>
      <h4 className="mb-4 bg-indigo-600 px-5 py-2 font-bold text-white rounded-xl">Yapılanlar : {countCompleted} , Yapılacaklar: {todos.length - countCompleted}</h4>

      <div className="space-y-5">
        {todos.map((todo) => (
          <Todo key={todo.id} {...todo} handleComplated={handleComplated} />
        ))}
      </div>
    </div>
  );
}

   

function Todo({ id, title, completed, handleComplated }) {
  return (
    <div className="relative flex items-start border bg-black p-2 shadow-xl shadow-indigo-300 rounded-xl  ">
      <div className="flex h-6 items-center">
        <input
          id="completed"
          name="completed"
          type="checkbox"
          onChange={() => handleComplated(id)}
          checked={completed}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 "
        />
      </div>
      <div className="ml-3 text-sm leading-6">
        <div className={`font-medium  text-indigo-500 ${completed ? "line-through" : ""}`}>{title}</div>
      </div>
    </div>
  );
}
