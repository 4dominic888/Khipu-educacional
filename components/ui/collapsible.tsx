import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

interface CollapseProps {
    open: boolean
    onToggle: () => void
    header: React.ReactNode
    children: React.ReactNode
}

const Collapsible = CollapsiblePrimitive.Root
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

const Collapse = ({ open, onToggle, header, children }: CollapseProps) => (
    <Collapsible open={open} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
            {header}
        </CollapsibleTrigger>
        
        {open &&
            <CollapsibleContent>
                <div className="pt-0"> {children} </div>
            </CollapsibleContent>
        }
    </Collapsible>
)

export { Collapsible, CollapsibleTrigger, CollapsibleContent, Collapse }