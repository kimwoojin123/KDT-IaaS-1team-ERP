'use client'
import { useEffect, useState } from 'react';


interface Category {
  cateName : string
}

export default function Category(){
  const [category, setCategory] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/category') 
      .then((response) => {
        if (!response.ok) {
          throw new Error('카테고리 데이터를 가져오는 데 문제가 발생했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        setCategory(data); 
      })
      .catch((error) => {
        console.error('Error fetching category:', error);
      });
  }, []);
  return(
    <ul>
        {category.map((category, index) => (
          <li key={index}>{category.cateName}</li>
        ))}
    </ul>
  )
}