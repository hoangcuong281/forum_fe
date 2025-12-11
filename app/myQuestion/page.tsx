

type Question = {
    id: number;
    title: string;
    topicID: number;
    content: string;
}

export default function myQuestion(){
    const questions = [] as Question[];
    
    const res = fetch('http://localhost:8080/api/questions/my',{
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include', // include cookies from server
      })
    .then(async (res) => {
        if (res.ok) {
            const data = await res.json();
            questions.push(...data);
        }
    })
    .catch((error) => {
        console.error('Error fetching questions:', error);
    });
    return (
        <div>myQuestion Page</div>
        
    )
}