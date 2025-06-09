export interface NFTProperty {
  trait: string
  value: string
}

interface NFTPropertiesProps {
  properties: NFTProperty[]
}

export default function NFTProperties({ properties }: NFTPropertiesProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {properties.map((property, index) => (
        <div key={index} className="p-3 border rounded-lg bg-muted/20">
          <p className="text-xs text-muted-foreground">{property.trait}</p>
          <p className="font-medium truncate">{property.value}</p>
        </div>
      ))}
    </div>
  )
}
