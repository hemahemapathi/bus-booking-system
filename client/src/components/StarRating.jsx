export default function StarRating({ value, onChange, size = 'md' }) {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          className={`${sizes[size]} transition ${star <= value ? 'text-yellow-400' : 'text-gray-300'} ${onChange ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
