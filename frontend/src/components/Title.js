const Title = ({ children }) => {
    if (typeof children !== 'string') {
        console.error('props.children must be a string');
        return null;
    }

    let [first, ...rest] = children.split(' ');
    first = (<span className="font-bold">{first}</span>)

    return (
        <div className="inline-block md:pr-20 border-b border-mpred mb-4">
            <h3 className="text-lg">{first} {rest.join(' ')}</h3>
        </div>
    )
}

export default Title;
