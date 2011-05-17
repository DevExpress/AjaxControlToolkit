namespace CustomData
{
    public class Change<T>
    {
        public ChangeOperationType action;
        public T item;
    }

    public enum ChangeOperationType { insert, update, remove }
}