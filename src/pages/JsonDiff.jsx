import ToolPlaceholder from '../components/ToolPlaceholder'

export default function JsonDiff() {
  return (
    <ToolPlaceholder
      title="JSON Shape Diff"
      description="Compare two JSON payloads and surface missing keys, type mismatches, and schema drift before deployment."
    />
  )
}
